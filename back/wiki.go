package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"

	"time"

	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	jwt "github.com/dgrijalva/jwt-go"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

var db *sql.DB

//const hostName = "http://localhost:8080"
const hostName = "http://46.41.136.25/app"
const CLIENT_ID = "ANOkwl33Ja5JX2ctrzF6FSXwhDbgiGU6"
const CLIENT_DOMAIN = "k4liber.eu.auth0.com"
const CLIENT_SECRET = "6I_oCVGgrCJ4bQz1AhoUuixbbIOL4BRSXmOyAackQAP37sMsyOfXig5AjG9jzkhQ"
const API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFqZENNMFV5T0VNM00wRXdNVFZHUVVRMk56RkdOVGMyTkRZMk0wSXdRME00TkVVelFVUkVPUSJ9.eyJpc3MiOiJodHRwczovL2s0bGliZXIuZXUuYXV0aDAuY29tLyIsInN1YiI6ImNyeTUwV0ZYNVJrSUlVbGY1aUdiRnFwQURqQ1g3UlRrQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2s0bGliZXIuZXUuYXV0aDAuY29tL2FwaS92Mi8iLCJleHAiOjE1MDAxNTIxMjYsImlhdCI6MTQ5MTUxMjEyNiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDp0ZW5hbnRfc2V0dGluZ3MgdXBkYXRlOnRlbmFudF9zZXR0aW5ncyByZWFkOmxvZ3MgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMifQ.oqheDADiW3ueJZhoP3LtODWqWYGsNEziRzHP6ASOhxzQATcREp4fqGXx2I2yNjYFSxRhPqKofYSeaMFsmgegvWvKmsonYbjhYDF8T0DIowSbE2beXmPb38puEZ3Ij4isLLQlp_1qAy7YGYvmrHJnnPcvhZGD7MB9o31Sw6vqK3jRG5KKfzT-PfqSsY2qjZRkmFtS2GjsmtGfs3UZy6RmDGH1RYnmwNRpYggrvTsLscVeW_KEUjbq68IB2Bv8Q3Wv7lzQ7AuPFFWXzNZJrx3MPDeMoGfALXjbo1lUonomoAMRV2fX1N-_JVYo2SFuhQBc9YN27vV7_DbhyPE99LL5Zg"

type justFilesFilesystem struct {
	fs http.FileSystem
}

func (fs justFilesFilesystem) Open(name string) (http.File, error) {
	f, err := fs.fs.Open(name)
	if err != nil {
		return nil, err
	}
	return neuteredReaddirFile{f}, nil
}

type neuteredReaddirFile struct {
	http.File
}

func (f neuteredReaddirFile) Readdir(count int) ([]os.FileInfo, error) {
	return nil, nil
}

type Comment struct {
	ID             int
	MemID          int
	AuthorNickname string
	AuthorPhoto    string
	Content        string
	DateTime       string
	Points         int
	Like           bool
}

type MemPoint struct {
	ID             int
	MemID          int
	AuthorNickname string
	DateTime       string
}

type CommentPoint struct {
	ID             int
	CommentID      int
	AuthorNickname string
	DateTime       string
	MemID          int
}

type Mem struct {
	ID             int
	Signature      string
	ImgExt         string
	DateTime       string
	AuthorNickname string
	Category       string
	Points         int
	Views          int
	Like           bool
}

type MemView struct {
	Comments []Comment
	Mem      Mem
}

type Activity struct {
	MemID       int
	Description string
	DateTime    string
}

func getCategoryMems(category string, nickname string) []Mem {
	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	rows, err3 := db.Query("SELECT * FROM mem WHERE category='" + category + "'")
	if err3 != nil {
		fmt.Println(err3.Error())
	}
	var ID int
	var Signature string
	var ImgExt string
	var DateTime string
	var AuthorNickname string
	var Category string
	var Points int
	var Views int
	var slice []Mem
	var turnedSlice []Mem
	for rows.Next() {
		err3 = rows.Scan(&ID, &Signature, &ImgExt, &DateTime, &AuthorNickname, &Category, &Points, &Views)
		var liked = false
		if getMemLike(ID, nickname).ID != 0 {
			liked = true
		}
		mem := &Mem{
			ID:             ID,
			Signature:      Signature,
			ImgExt:         ImgExt,
			DateTime:       DateTime,
			AuthorNickname: AuthorNickname,
			Category:       Category,
			Points:         Points,
			Views:          Views,
			Like:           liked,
		}
		slice = append(slice, *mem)
		turnedSlice = append(turnedSlice, *mem)
	}
	for index := range slice {
		var indexTurned = len(slice) - 1 - index
		turnedSlice[indexTurned] = slice[index]
	}
	defer db.Close()
	return turnedSlice
}

func getMemLike(ID int, authorNickname string) MemPoint {
	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	rows, err3 :=
		db.Query("SELECT * FROM memPoint WHERE memId=" + strconv.Itoa(ID) +
			" AND authorNickname='" + authorNickname + "' LIMIT 1")
	var pointID int
	var MemID int
	var AuthorNickname string
	var DateTime string
	for rows.Next() {
		err3 = rows.Scan(&pointID, &MemID, &AuthorNickname, &DateTime)
	}
	memPoint := MemPoint{
		ID:             pointID,
		MemID:          MemID,
		AuthorNickname: AuthorNickname,
		DateTime:       DateTime,
	}

	if err3 != nil {
		fmt.Println(err3.Error())
	}
	defer db.Close()
	return memPoint
}

func getProfileMemLike(authorNickname string) []MemPoint {
	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	rows, err3 :=
		db.Query("SELECT * FROM memPoint WHERE authorNickname='" + authorNickname + "'")
	var pointID int
	var MemID int
	var AuthorNickname string
	var DateTime string
	var slice []MemPoint
	for rows.Next() {
		err3 = rows.Scan(&pointID, &MemID, &AuthorNickname, &DateTime)
		memPoint := &MemPoint{
			ID:             pointID,
			MemID:          MemID,
			AuthorNickname: AuthorNickname,
			DateTime:       DateTime,
		}
		slice = append(slice, *memPoint)
	}

	if err3 != nil {
		fmt.Println(err3.Error())
	}
	defer db.Close()
	return slice
}

func getProfileCommentLike(authorNickname string) []CommentPoint {
	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}
	rows, err3 :=
		db.Query("SELECT * FROM commentPoint WHERE authorNickname='" + authorNickname + "'")
	var PointID int
	var CommentID int
	var MemID int
	var AuthorNickname string
	var DateTime string
	var slice []CommentPoint
	for rows.Next() {
		err3 = rows.Scan(&PointID, &CommentID, &AuthorNickname, &DateTime, &MemID)
		commentPoint := &CommentPoint{
			ID:             PointID,
			CommentID:      CommentID,
			AuthorNickname: AuthorNickname,
			DateTime:       DateTime,
			MemID:          MemID,
		}
		slice = append(slice, *commentPoint)
	}
	if err3 != nil {
		fmt.Println(err3.Error())
	}
	defer db.Close()
	return slice
}

func getCommentLike(ID int, authorNickname string) CommentPoint {
	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	rows, err3 :=
		db.Query("SELECT * FROM commentPoint WHERE commentId=" + strconv.Itoa(ID) +
			" AND authorNickname='" + authorNickname + "' LIMIT 1")
	var PointID int
	var CommentID int
	var MemID int
	var AuthorNickname string
	var DateTime string
	for rows.Next() {
		err3 = rows.Scan(&PointID, &CommentID, &AuthorNickname, &DateTime, &MemID)
	}
	commentPoint := CommentPoint{
		ID:             PointID,
		CommentID:      CommentID,
		AuthorNickname: AuthorNickname,
		DateTime:       DateTime,
		MemID:          MemID,
	}

	if err3 != nil {
		fmt.Println(err3.Error())
	}
	defer db.Close()
	return commentPoint
}

func getProfileActivities(nickname string) []Activity {
	var mems = getProfileMems(nickname)
	var comments = getProfileComments(nickname)
	var commentLikes = getProfileCommentLike(nickname)
	var memLikes = getProfileMemLike(nickname)
	var slice []Activity
	var memID int
	var description string
	var dateTime string
	var signature string
	var commentContent string
	for _, mem := range mems {
		memID = mem.ID
		if len(mem.Signature) > 30 {
			signature = mem.Signature[0:29] + "..."
		} else {
			signature = mem.Signature
		}
		description = "Your mem '" + signature + "' has been added."
		dateTime = mem.DateTime
		activity := &Activity{
			MemID:       memID,
			Description: description,
			DateTime:    dateTime,
		}
		slice = append(slice, *activity)
	}
	for _, comment := range comments {
		if len(comment.Content) > 30 {
			commentContent = comment.Content[0:29] + "..."
		} else {
			commentContent = comment.Content
		}
		memID = comment.MemID
		description = "Your comment '" + commentContent + "' has been added."
		dateTime = comment.DateTime
		activity := &Activity{
			MemID:       memID,
			Description: description,
			DateTime:    dateTime,
		}
		slice = append(slice, *activity)
	}
	for _, commentLike := range commentLikes {
		memID = commentLike.MemID
		description = "Your like this comment!"
		dateTime = commentLike.DateTime
		activity := &Activity{
			MemID:       memID,
			Description: description,
			DateTime:    dateTime,
		}
		slice = append(slice, *activity)
	}
	for _, memLike := range memLikes {
		memID = memLike.MemID
		description = "Your like this idea!"
		dateTime = memLike.DateTime
		activity := &Activity{
			MemID:       memID,
			Description: description,
			DateTime:    dateTime,
		}
		slice = append(slice, *activity)
	}
	return slice
}

func getProfileMems(nickname string) []Mem { //DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	rows, err3 := db.Query("SELECT * FROM mem WHERE authorNickname='" + nickname + "'")
	if err3 != nil {
		fmt.Println(err3.Error())
	}
	var ID int
	var Signature string
	var ImgExt string
	var DateTime string
	var AuthorNickname string
	var Category string
	var Points int
	var Views int
	var slice []Mem
	var turnedSlice []Mem
	for rows.Next() {
		err3 = rows.Scan(&ID, &Signature, &ImgExt, &DateTime, &AuthorNickname, &Category, &Points, &Views)
		var liked = false
		if getMemLike(ID, nickname).ID != 0 {
			liked = true
		}
		mem := &Mem{
			ID:             ID,
			Signature:      Signature,
			ImgExt:         ImgExt,
			DateTime:       DateTime,
			AuthorNickname: AuthorNickname,
			Category:       Category,
			Points:         Points,
			Views:          Views,
			Like:           liked,
		}
		slice = append(slice, *mem)
		turnedSlice = append(turnedSlice, *mem)
	}
	for index := range slice {
		var indexTurned = len(slice) - 1 - index
		turnedSlice[indexTurned] = slice[index]
	}
	defer db.Close()
	return turnedSlice
}

func getMems(nickname string) []Mem {
	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	rows, err3 := db.Query("SELECT * FROM mem")
	if err3 != nil {
		fmt.Println(err3.Error())
	}
	var ID int
	var Signature string
	var ImgExt string
	var DateTime string
	var AuthorNickname string
	var Category string
	var Points int
	var Views int
	var slice []Mem
	var turnedSlice []Mem
	for rows.Next() {
		err3 = rows.Scan(&ID, &Signature, &ImgExt, &DateTime, &AuthorNickname, &Category, &Points, &Views)
		var liked = false
		if getMemLike(ID, nickname).ID != 0 {
			liked = true
		}
		mem := &Mem{
			ID:             ID,
			Signature:      Signature,
			ImgExt:         ImgExt,
			DateTime:       DateTime,
			AuthorNickname: AuthorNickname,
			Category:       Category,
			Points:         Points,
			Views:          Views,
			Like:           liked,
		}
		slice = append(slice, *mem)
		turnedSlice = append(turnedSlice, *mem)
	}
	for index := range slice {
		var indexTurned = len(slice) - 1 - index
		turnedSlice[indexTurned] = slice[index]
	}
	defer db.Close()
	return turnedSlice
}

func getMem(id string, nickname string) Mem {
	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	rows, err3 := db.Query("SELECT * FROM mem WHERE ID='" + id + "'")
	if err3 != nil {
		fmt.Println(err3.Error())
	}
	var ID int
	var Signature string
	var ImgExt string
	var DateTime string
	var AuthorNickname string
	var Category string
	var Points int
	var Views int
	for rows.Next() {
		err3 = rows.Scan(&ID, &Signature, &ImgExt, &DateTime, &AuthorNickname, &Category, &Points, &Views)
	}
	var liked = false
	if getMemLike(ID, nickname).ID != 0 {
		liked = true
	}
	mem := Mem{
		ID:             ID,
		Signature:      Signature,
		ImgExt:         ImgExt,
		DateTime:       DateTime,
		AuthorNickname: AuthorNickname,
		Category:       Category,
		Points:         Points,
		Views:          Views + 1,
		Like:           liked,
	}

	var views = mem.Views
	update, errUpdate := db.Exec("UPDATE mem SET views=" + strconv.Itoa(views) + " WHERE id=" +
		strconv.Itoa(mem.ID))
	if errUpdate != nil {
		fmt.Println(errUpdate)
		fmt.Println(update)
	}

	defer db.Close()
	return mem
}

func getNickname(userID string) string {
	url := "https://k4liber.eu.auth0.com/api/v2/users/" + userID

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("authorization", "Bearer "+API_TOKEN)

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	var raw map[string]string
	json.Unmarshal(body, &raw)

	return raw["nickname"]
}

func getComments(id string, nickname string) []Comment {
	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	rows, err3 := db.Query("SELECT * FROM comment WHERE memID='" + id + "'")
	if err3 != nil {
		fmt.Println(err3.Error())
	}
	var ID int
	var MemID int
	var AuthorNickname string
	var AuthorPhoto string
	var Content string
	var DateTime string
	var Points int
	var slice []Comment

	for rows.Next() {
		err3 = rows.Scan(&ID, &MemID, &AuthorNickname, &AuthorPhoto, &Content, &DateTime, &Points)
		var liked = false
		if getCommentLike(ID, nickname).ID != 0 {
			liked = true
		}
		comment := &Comment{
			ID:             ID,
			MemID:          MemID,
			AuthorNickname: AuthorNickname,
			AuthorPhoto:    AuthorPhoto,
			Content:        Content,
			DateTime:       DateTime,
			Points:         Points,
			Like:           liked,
		}
		slice = append(slice, *comment)
	}
	defer db.Close()
	return slice
}

func getProfileComments(nickname string) []Comment {
	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	rows, err3 := db.Query("SELECT * FROM comment WHERE authorNickname='" + nickname + "'")
	if err3 != nil {
		fmt.Println(err3.Error())
	}
	var ID int
	var MemID int
	var AuthorNickname string
	var AuthorPhoto string
	var Content string
	var DateTime string
	var Points int
	var slice []Comment

	for rows.Next() {
		err3 = rows.Scan(&ID, &MemID, &AuthorNickname, &AuthorPhoto, &Content, &DateTime, &Points)
		var liked = false
		if getCommentLike(ID, nickname).ID != 0 {
			liked = true
		}
		comment := &Comment{
			ID:             ID,
			MemID:          MemID,
			AuthorNickname: AuthorNickname,
			AuthorPhoto:    AuthorPhoto,
			Content:        Content,
			DateTime:       DateTime,
			Points:         Points,
			Like:           liked,
		}
		slice = append(slice, *comment)
	}
	defer db.Close()
	return slice
}

func main() {
	/*
		// Here we are loading in our .env file which will contain our Auth0 Client Secret and Domain
		errEnv := godotenv.Load()
		if errEnv != nil {
			log.Fatal("Error loading .env file")
		}
	*/
	var entry string
	var static string
	var port string

	flag.StringVar(&entry, "entry", "./build/index.html", "the entrypoint to serve.")
	flag.StringVar(&static, "static", ".", "the directory to serve static files from.")
	flag.StringVar(&port, "port", "80", "the `port` to listen on.")
	flag.Parse()

	r := mux.NewRouter()

	//r.Handle("/", http.FileServer(http.Dir("./views/")))
	c := cors.New(cors.Options{
		AllowedOrigins:     []string{"*", "46.41.136.25", "visionaries.pl"},
		OptionsPassthrough: true,
		AllowedHeaders:     []string{"*"},
	})

	api := r.PathPrefix("/app/").Subrouter()
	api.Handle("/mems", c.Handler(MemsHandler))
	api.Handle("/mem/{id}", c.Handler(MemHandler))
	api.Handle("/profile/{nickname}", c.Handler(ProfileHandler))
	api.Handle("/activities/{nickname}", c.Handler(ActivitiesHandler))
	api.Handle("/category/{category}", c.Handler(CategoryHandler))
	api.Handle("/addMem", c.Handler(PreHandler(AddMemHandler)))
	api.Handle("/uploadAvatar", c.Handler(PreHandler(UploadAvatarHandler)))
	api.Handle("/addComment", c.Handler(PreHandler(AddCommentHandler)))
	api.Handle("/addMemPoint", c.Handler(PreHandler(AddMemPointHandler)))
	api.Handle("/deleteMemPoint", c.Handler(PreHandler(DeleteMemPointHandler)))
	api.Handle("/deleteMem", c.Handler(PreHandler(DeleteMemHandler)))
	api.Handle("/adminDeleteMem", c.Handler(PreHandler(AdminDeleteMemHandler)))
	api.Handle("/addCommentPoint", c.Handler(PreHandler(AddCommentPointHandler)))
	api.Handle("/deleteCommentPoint", c.Handler(PreHandler(DeleteCommentPointHandler)))
	api.Handle("/deleteComment", c.Handler(PreHandler(DeleteCommentHandler)))
	api.Handle("/adminDeleteComment", c.Handler(PreHandler(AdminDeleteCommentHandler)))

	// Serve static assets directly.
	r.PathPrefix("/resources").Handler(http.FileServer(http.Dir(static)))
	r.PathPrefix("/img").Handler(http.FileServer(http.Dir(static)))
	r.PathPrefix("/static").Handler(http.FileServer(http.Dir(static)))
	// Catch-all: Serve our JavaScript application's entry-point (index.html).
	r.PathPrefix("/favicon.ico").HandlerFunc(IconHandler("./build/favicon.ico"))
	r.PathPrefix("/").HandlerFunc(IndexHandler(entry))
	//r.PathPrefix("/").Handler(http.FileServer(http.Dir(static)))
	//46.41.136.25
	srv := &http.Server{
		Handler: handlers.LoggingHandler(os.Stdout, r),
		Addr:    "46.41.136.25:" + port,
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())

	//http.ListenAndServe(":8080", nil)
}

func IconHandler(entrypoint string) func(w http.ResponseWriter, r *http.Request) {
	fn := func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, entrypoint)
	}
	return http.HandlerFunc(fn)
}

func IndexHandler(entrypoint string) func(w http.ResponseWriter, r *http.Request) {
	fn := func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, entrypoint)
	}
	return http.HandlerFunc(fn)
}

var NotImplemented = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Not Implemented"))
})

var jwtMiddleware = jwtmiddleware.New(jwtmiddleware.Options{
	ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
		token2 := os.Getenv("AUTH0_CLIENT_SECRET")
		if len(token2) == 0 {
			return nil, errors.New("Auth0 Client Secret Not Set")
		}
		return token2, nil
	},
})

type MyServer struct {
	r *mux.Router
}

func (s *MyServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	payload, _ := json.Marshal(getMems(r.Header.Get("nickname")))
	if origin := r.Header.Get("Origin"); origin != "" {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers",
			"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, nickname")
	}
	w.Write([]byte(payload))
	s.r.ServeHTTP(w, r)
}

var ActivitiesHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	payload, _ := json.Marshal(getProfileActivities(vars["nickname"]))
	w.Header().Set("Content-Type", "application/json")
	var origin = req.Header.Get("Origin")
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers",
		"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, nickname")
	w.Header().Set("Allow", "*")
	if req.Method == "OPTIONS" {
		return
	}
	w.Write([]byte(payload))
})

var ProfileHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	payload, _ := json.Marshal(getProfileMems(vars["nickname"]))
	w.Header().Set("Content-Type", "application/json")
	var origin = req.Header.Get("Origin")
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers",
		"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, nickname")
	w.Header().Set("Allow", "*")
	if req.Method == "OPTIONS" {
		return
	}
	w.Write([]byte(payload))
})

var MemsHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	payload, _ := json.Marshal(getMems(req.Header.Get("nickname")))
	w.Header().Set("Content-Type", "application/json")
	var origin = req.Header.Get("Origin")
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers",
		"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, nickname")
	w.Header().Set("Allow", "*")
	if req.Method == "OPTIONS" {
		return
	}
	w.Write([]byte(payload))
})

var CategoryHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	payload, _ := json.Marshal(getCategoryMems(vars["category"], req.Header.Get("nickname")))
	w.Header().Set("Content-Type", "application/json")
	var origin = req.Header.Get("Origin")
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers",
		"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, nickname")
	w.Header().Set("Allow", "*")
	if req.Method == "OPTIONS" {
		return
	}
	w.Write([]byte(payload))
})

var MemHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var origin = req.Header.Get("Origin")
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers",
		"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, nickname")
	w.Header().Set("Allow", "*")
	if req.Method == "OPTIONS" {
		return
	}

	vars := mux.Vars(req)
	mem := getMem(vars["id"], req.Header.Get("nickname"))
	comments := getComments(vars["id"], req.Header.Get("nickname"))
	memView := MemView{
		Comments: comments,
		Mem:      mem,
	}
	payload, _ := json.Marshal(memView)

	w.Write([]byte(payload))
})

func uploadUserComments(nickname string, avatarName string) bool {
	var photoUrl = hostName + "/resources/avatars/" + avatarName
	var success = true
	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
		success = false
	}
	update, errUpdate := db.Exec("UPDATE comment SET authorPhoto='" + photoUrl + "' WHERE authorNickname='" + nickname + "'")
	if errUpdate != nil {
		fmt.Println(errUpdate)
		fmt.Println(update)
		success = false
	}
	defer db.Close()
	return success
}

var UploadAvatarHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {

	var nickname = req.FormValue("authorNickname")
	var extension = req.FormValue("extension")
	var avatarName = nickname + "." + extension
	//Zapisanie zdjecia
	req.ParseMultipartForm(32 << 20)
	file, handler, err := req.FormFile("file")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()
	fmt.Fprintf(w, "%v", handler.Header)
	var fileName = "./resources/avatars/" + avatarName
	f, err := os.OpenFile(fileName, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer f.Close()
	io.Copy(f, file)

	uploadUserComments(nickname, avatarName)

	//Wysylanie odpowiedzi
	payload, _ := json.Marshal(avatarName)
	w.Header().Set("Avatar-Name", avatarName)
	w.Write([]byte(payload))
})

var AddMemHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {

	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	//Dodawanie mema
	var title = req.FormValue("title")
	var extension = req.FormValue("extension")
	var category = req.FormValue("category")
	var author = req.FormValue("authorNickname")
	datetime := time.Now().Format(time.RFC3339)
	result, err2 := db.Exec(
		"INSERT INTO mem (signature, imgExt, dateTime, authorNickname, category) VALUES (?, ?, ?, ?, ?)",
		title,
		"."+extension,
		datetime,
		author,
		category,
	)
	if err2 != nil {
		fmt.Println(err2.Error())
	}
	memID, err6 := result.LastInsertId()
	if err6 != nil {
		fmt.Println(err6)
	}

	//Dodawanie komentarza
	var comment = req.FormValue("comment")
	if comment != "" {
		var profilePicture = req.FormValue("profilePicture")
		result2, errComment := db.Exec(
			"INSERT INTO comment (memId, authorNickname, authorPhoto, content, dateTime) VALUES (?, ?, ?, ?, ?)",
			strconv.FormatInt(memID, 10),
			author,
			profilePicture,
			comment,
			datetime,
		)
		if errComment != nil {
			fmt.Println(errComment.Error())
		}
		commentID, errCommentID := result2.LastInsertId()
		if errCommentID != nil {
			fmt.Println(errCommentID)
			fmt.Println(commentID)
		}
	}
	//Zapisanie zdjecia
	req.ParseMultipartForm(32 << 20)
	file, handler, err := req.FormFile("file")
	var success = true
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()
	fmt.Fprintf(w, "%v", handler.Header)
	var fileName = "./resources/mems/" + strconv.FormatInt(memID, 10) + "." + extension
	f, err := os.OpenFile(fileName, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer f.Close()
	io.Copy(f, file)

	//Wysylanie odpowiedzi
	payload, _ := json.Marshal(success)
	w.Write([]byte(payload))
	defer db.Close()
})

var AddCommentHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {

	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	//Dodawanie komentarza
	datetime := time.Now().Format(time.RFC3339)
	var memID = req.FormValue("memID")
	var nickname = req.FormValue("authorNickname")
	var profilePicture = req.FormValue("profilePicture")
	var comment = req.FormValue("comment")
	result, errComment := db.Exec(
		"INSERT INTO comment (memId, authorNickname, authorPhoto, content, dateTime) VALUES (?, ?, ?, ?, ?)",
		memID,
		nickname,
		profilePicture,
		comment,
		datetime,
	)
	if errComment != nil {
		fmt.Println(errComment.Error())
		fmt.Println(result)
	}

	//Select
	sel, errSelect := db.Query(
		"SELECT * FROM comment WHERE authorNickname='" + nickname + "' AND dateTime='" + datetime + "'",
	)
	if errSelect != nil {
		fmt.Println(errSelect.Error())
		fmt.Println(sel)
	}

	var ID int
	var MemID int
	var AuthorNickname string
	var AuthorPhoto string
	var Content string
	var DateTime string
	var Points int
	var Like = false

	for sel.Next() {
		errSelect = sel.Scan(&ID, &MemID, &AuthorNickname, &AuthorPhoto, &Content, &DateTime, &Points)
	}

	commentObj := Comment{
		ID:             ID,
		MemID:          MemID,
		AuthorNickname: AuthorNickname,
		AuthorPhoto:    AuthorPhoto,
		Content:        Content,
		DateTime:       DateTime,
		Points:         Points,
		Like:           Like,
	}

	//Wysylanie odpowiedzi
	payload, _ := json.Marshal(commentObj)
	w.Write([]byte(payload))
	defer db.Close()
})

var AdminDeleteMemHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {

	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	//Form data
	var memID = req.FormValue("memID")
	var authorNickname = req.FormValue("authorNickname")

	if authorNickname != "janbielecki94" {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("500 - You are not an admin!"))
		return
	}

	var success = true

	//Delete memPoints
	_, resErr1 := db.Query("DELETE FROM memPoint WHERE memId=" + memID)
	if resErr1 != nil {
		fmt.Println(resErr1)
		success = false
		return
	}

	//Delete comments
	_, resErr2 := db.Query("DELETE FROM comment WHERE memId=" + memID)
	if resErr2 != nil {
		fmt.Println(resErr2)
		success = false
		return
	}

	//Delete commentsPoints
	_, resErr3 := db.Query("DELETE FROM commentPoint WHERE memId=" + memID)
	if resErr3 != nil {
		fmt.Println(resErr3)
		success = false
		return
	}

	//Delete mem
	_, resErr4 := db.Query("DELETE FROM mem WHERE id=" + memID)
	if resErr4 != nil {
		fmt.Println(resErr4)
		success = false
		return
	}

	//Wysylanie odpowiedzi
	payload, _ := json.Marshal(success)
	w.Write([]byte(payload))
	defer db.Close()
})

var DeleteMemHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {

	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	var success = true

	//Form data
	var memID = req.FormValue("memID")
	var authorNickname = req.FormValue("authorNickname")

	fmt.Println(memID)
	fmt.Println(authorNickname)

	//Delete memPoints
	_, resErr1 := db.Query("DELETE FROM memPoint WHERE memId=" + memID)
	if resErr1 != nil {
		fmt.Println(resErr1)
		success = false
		return
	}

	//Delete comments
	_, resErr2 := db.Query("DELETE FROM comment WHERE memId=" + memID)
	if resErr2 != nil {
		fmt.Println(resErr2)
		success = false
		return
	}

	//Delete commentsPoints
	_, resErr3 := db.Query("DELETE FROM commentPoint WHERE memId=" + memID)
	if resErr3 != nil {
		fmt.Println(resErr3)
		success = false
		return
	}

	//Delete mem
	_, resErr4 := db.Query("DELETE FROM mem WHERE id=" + memID)
	if resErr4 != nil {
		fmt.Println(resErr4)
		success = false
		return
	}

	//Wysylanie odpowiedzi
	payload, _ := json.Marshal(success)
	w.Write([]byte(payload))
	defer db.Close()
})

var DeleteMemPointHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {

	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	var success = true

	//Dodawanie pointa
	var memID = req.FormValue("memID")
	var authorNickname = req.FormValue("authorNickname")
	res, resErr := db.Query("SELECT * FROM memPoint WHERE memId=" + memID + " AND authorNickname='" +
		authorNickname + "' LIMIT 1")

	if resErr != nil {
		fmt.Println(resErr)
	}

	var IDFromDb int
	var memIDFromDb int
	var authorNicknameFromDb string
	var dateTimeFromDb string

	for res.Next() {
		resErr = res.Scan(&IDFromDb, &memIDFromDb, &authorNicknameFromDb, &dateTimeFromDb)
	}

	if IDFromDb != 0 {
		result, errComment := db.Exec(
			"DELETE FROM memPoint WHERE memId=" +
				memID + " AND authorNickname='" + authorNickname + "'",
		)
		//Count points
		count, errCount := db.Query("SELECT * FROM memPoint WHERE memId=" + memID)
		var points = 0
		if errCount != nil {
			fmt.Println(errCount)
		}
		for count.Next() {
			points++
		}
		//Update
		update, errUpdate := db.Exec("UPDATE mem SET points=" + strconv.Itoa(points) + " WHERE id=" + memID)
		if errUpdate != nil {
			fmt.Println(errUpdate)
			fmt.Println(update)
		}

		if errComment != nil {
			fmt.Println(errComment.Error())
			fmt.Println(result)
			success = false
		}
	} else {
		success = false

	}

	//Wysylanie odpowiedzi
	payload, _ := json.Marshal(success)
	w.Write([]byte(payload))
	defer db.Close()
})

var AddMemPointHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {

	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	var success = true

	//Dodawanie pointa
	dateTime := time.Now().Format(time.RFC3339)
	var memID = req.FormValue("memID")
	var authorNickname = req.FormValue("authorNickname")
	res, resErr := db.Query("SELECT * FROM memPoint WHERE memId=" + memID + " AND authorNickname='" +
		authorNickname + "' LIMIT 1")

	if resErr != nil {
		fmt.Println(resErr)
	}

	var IDFromDb int
	var memIDFromDb int
	var authorNicknameFromDb string
	var dateTimeFromDb string

	for res.Next() {
		resErr = res.Scan(&IDFromDb, &memIDFromDb, &authorNicknameFromDb, &dateTimeFromDb)
	}

	if IDFromDb != 0 {
		success = false
	} else {
		result, errComment := db.Exec(
			"INSERT INTO memPoint (memId, authorNickname, dateTime) VALUES ('" +
				memID + "', '" + authorNickname + "', '" + dateTime + "')",
		)
		//Count points
		count, errCount := db.Query("SELECT * FROM memPoint WHERE memId=" + memID)
		var points = 0
		if errCount != nil {
			fmt.Println(errCount)
		}
		for count.Next() {
			points++
		}
		//Update
		update, errUpdate := db.Exec("UPDATE mem SET points=" + strconv.Itoa(points) + " WHERE id=" + memID)
		if errUpdate != nil {
			fmt.Println(errUpdate)
			fmt.Println(update)
		}

		if errComment != nil {
			fmt.Println(errComment.Error())
			fmt.Println(result)
			success = false
		}
	}

	//Wysylanie odpowiedzi
	payload, _ := json.Marshal(success)
	w.Write([]byte(payload))
	defer db.Close()
})

var PreHandler = func(handler http.HandlerFunc) http.HandlerFunc {
	// one time scope setup area for middleware
	return func(w http.ResponseWriter, req *http.Request) {
		//Autorize
		var nickname = getNickname(req.FormValue("userID"))
		var authorNickname = req.FormValue("authorNickname")
		if nickname != authorNickname {
			fmt.Println(authorNickname)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("500 - Cannot authorize!"))
			return
		}
		handler(w, req)
	}
}

var AdminDeleteCommentHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {

	var commentID = req.FormValue("commentID")
	var authorNickname = req.FormValue("authorNickname")

	if authorNickname != "janbielecki94" {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("500 - You are not an admin!"))
		return
	}

	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("500 - Cannot connect to database!"))
		return
	}
	_, err3 :=
		db.Query("DELETE FROM commentPoint WHERE commentId=" + commentID)
	if err3 != nil {
		fmt.Println(err3)
	}
	_, err4 :=
		db.Query("DELETE FROM comment WHERE id=" + commentID)
	if err4 != nil {
		fmt.Println(err4)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("500 - Cannot delete comment from database!"))
		return
	}
	//Wysylanie odpowiedzi
	w.Header().Set("Content-Type", "application/json")
	var origin = req.Header.Get("Origin")
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers",
		"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, nickname")
	w.Header().Set("Allow", "*")
	if req.Method == "OPTIONS" {
		return
	}
	defer db.Close()
})

var DeleteCommentHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {

	var commentID = req.FormValue("commentID")

	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("500 - Cannot connect to database!"))
		return
	}
	_, err3 :=
		db.Query("DELETE FROM commentPoint WHERE commentId=" + commentID)
	if err3 != nil {
		fmt.Println(err3)
	}
	_, err4 :=
		db.Query("DELETE FROM comment WHERE id=" + commentID)
	if err4 != nil {
		fmt.Println(err4)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("500 - Cannot delete comment from database!"))
		return
	}
	//Wysylanie odpowiedzi
	w.Header().Set("Content-Type", "application/json")
	var origin = req.Header.Get("Origin")
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers",
		"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, nickname")
	w.Header().Set("Allow", "*")
	if req.Method == "OPTIONS" {
		return
	}
	defer db.Close()
})

var DeleteCommentPointHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	//Usuwanie pointa
	var commentID = req.FormValue("commentID")
	var authorNickname = req.FormValue("authorNickname")
	res, resErr := db.Query("SELECT * FROM commentPoint WHERE commentId=" + commentID + " AND authorNickname='" +
		authorNickname + "' LIMIT 1")

	if resErr != nil {
		fmt.Println(resErr)
	}

	var IDFromDb int
	var commentIDFromDb int
	var MemIDFromDb int
	var authorNicknameFromDb string
	var dateTimeFromDb string

	for res.Next() {
		resErr = res.Scan(&IDFromDb, &commentIDFromDb, &authorNicknameFromDb, &dateTimeFromDb, &MemIDFromDb)
	}

	if IDFromDb != 0 {
		result, errComment := db.Exec(
			"DELETE FROM commentPoint WHERE commentId=" +
				commentID + " AND authorNickname='" + authorNickname + "'",
		)
		if errComment != nil {
			fmt.Println(errComment.Error())
			fmt.Println(result)
			return
		}
		//Count points
		count, errCount := db.Query("SELECT * FROM commentPoint WHERE commentId=" + commentID)
		var points = 0
		if errCount != nil {
			fmt.Println(errCount)
		}
		for count.Next() {
			points++
		}

		//Update
		update, errUpdate := db.Exec("UPDATE comment SET points=" + strconv.Itoa(points) + " WHERE id=" + commentID)
		if errUpdate != nil {
			fmt.Println(errUpdate)
			fmt.Println(update)
			return
		}

		//Select
		sel, errSelect := db.Query("SELECT * FROM comment WHERE id=" + commentID)
		if errSelect != nil {
			fmt.Println(errSelect)
			fmt.Println(sel)
			return
		}

		var ID int
		var MemID int
		var AuthorNickname string
		var AuthorPhoto string
		var Content string
		var DateTime string
		var Points int
		var Like = false

		for sel.Next() {
			errSelect = sel.Scan(&ID, &MemID, &AuthorNickname, &AuthorPhoto, &Content, &DateTime, &Points)
		}

		comment := Comment{
			ID:             ID,
			MemID:          MemID,
			AuthorNickname: AuthorNickname,
			AuthorPhoto:    AuthorPhoto,
			Content:        Content,
			DateTime:       DateTime,
			Points:         Points,
			Like:           Like,
		}

		//Wysylanie odpowiedzi
		payload, _ := json.Marshal(comment)
		w.Write([]byte(payload))

	}

	defer db.Close()
})

var AddCommentPointHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	//Dodawanie pointa
	dateTime := time.Now().Format(time.RFC3339)
	var commentID = req.FormValue("commentID")
	var authorNickname = req.FormValue("authorNickname")
	var memID = req.FormValue("memID")
	res, resErr := db.Query("SELECT * FROM commentPoint WHERE commentId=" + commentID + " AND authorNickname='" +
		authorNickname + "' LIMIT 1")

	if resErr != nil {
		fmt.Println(resErr)
	}

	var IDFromDb int
	var commentIDFromDb int
	var MemIDFromDb int
	var authorNicknameFromDb string
	var dateTimeFromDb string

	for res.Next() {
		resErr = res.Scan(&IDFromDb, &commentIDFromDb, &authorNicknameFromDb, &dateTimeFromDb, &MemIDFromDb)
	}

	if !(IDFromDb != 0) {
		result, errComment := db.Exec(
			"INSERT INTO commentPoint (commentId, authorNickname, dateTime, memId) VALUES ('" +
				commentID + "', '" + authorNickname + "', '" + dateTime + "', '" + memID + "')",
		)

		if errComment != nil {
			fmt.Println(errComment.Error())
			fmt.Println(result)
			return
		}
		//Count points
		count, errCount := db.Query("SELECT * FROM commentPoint WHERE commentId=" + commentID)
		var points = 0
		if errCount != nil {
			fmt.Println(errCount)
		}
		for count.Next() {
			points++
		}

		//Update
		update, errUpdate := db.Exec("UPDATE comment SET points=" + strconv.Itoa(points) + " WHERE id=" + commentID)
		if errUpdate != nil {
			fmt.Println(errUpdate)
			fmt.Println(update)
			return
		}

		//Select
		sel, errSelect := db.Query("SELECT * FROM comment WHERE id=" + commentID)
		if errSelect != nil {
			fmt.Println(errSelect)
			fmt.Println(sel)
			return
		}

		var ID int
		var MemID int
		var AuthorNickname string
		var AuthorPhoto string
		var Content string
		var DateTime string
		var Points int
		var Like = true

		for sel.Next() {
			errSelect = sel.Scan(&ID, &MemID, &AuthorNickname, &AuthorPhoto, &Content, &DateTime, &Points)
		}

		comment := Comment{
			ID:             ID,
			MemID:          MemID,
			AuthorNickname: AuthorNickname,
			AuthorPhoto:    AuthorPhoto,
			Content:        Content,
			DateTime:       DateTime,
			Points:         Points,
			Like:           Like,
		}

		//Wysylanie odpowiedzi
		payload, _ := json.Marshal(comment)
		w.Write([]byte(payload))
	}

	defer db.Close()
})
