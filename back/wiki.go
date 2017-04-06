package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"time"

	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	jwt "github.com/dgrijalva/jwt-go"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

var db *sql.DB

const hostName = "http://localhost:8080"

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
	}
	defer db.Close()
	return slice
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
	//var comments = getProfileComments(nickname)
	//var commentLikes = getProfileCommentLike(nickname)
	//var memLikes = getProfileMemLike(nickname)
	var slice []Activity
	var memID int
	var description string
	var dateTime string
	for _, mem := range mems {
		memID = mem.ID
		description = "Your mem " + mem.Signature + " has been added."
		dateTime = mem.DateTime
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
		Views:          Views,
		Like:           liked,
	}
	defer db.Close()
	return mem
}

func getToken() {
	url := "https://k4liber.eu.auth0.com/oauth/token"

	payload := strings.NewReader("{\"grant_type\":\"client_credentials\",\"client_id\": \"wHdG0NB3oYgveHBX3nvsB4LDUkDnsCd4\",\"client_secret\": \"qeCIO0A-2Df1jHhqa0HwNxO9DyMCwZw10JrthmWc3tQpxRFg75D_mQHkkm7gx1uP\",\"audience\": \"https://k4liber.eu.auth0.com/api/v2/\"}")

	req, _ := http.NewRequest("POST", url, payload)

	req.Header.Add("content-type", "application/json")

	res, _ := http.DefaultClient.Do(req)

	defer res.Body.Close()
	body, _ := ioutil.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))
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
	// Here we are loading in our .env file which will contain our Auth0 Client Secret and Domain
	errEnv := godotenv.Load()
	if errEnv != nil {
		log.Fatal("Error loading .env file")
	}

	r := mux.NewRouter()
	r.Handle("/", http.FileServer(http.Dir("./views/")))
	c := cors.New(cors.Options{
		AllowedOrigins:     []string{"http://localhost:3000", "*"},
		OptionsPassthrough: true,
		AllowedHeaders:     []string{"nickname"},
	})
	r.Handle("/mems", c.Handler(MemsHandler))
	r.Handle("/mem/{id}", c.Handler(MemHandler))
	r.Handle("/profile/{nickname}", c.Handler(ProfileHandler))
	r.Handle("/activities/{nickname}", c.Handler(ActivitiesHandler))
	r.Handle("/category/{category}", c.Handler(CategoryHandler))
	r.Handle("/addMem", c.Handler(AddMemHandler))
	r.Handle("/uploadAvatar", c.Handler(UploadAvatarHandler))
	r.Handle("/addComment", c.Handler(AddCommentHandler))
	r.Handle("/addMemPoint", c.Handler(AddMemPointHandler))
	r.Handle("/deleteMemPoint", c.Handler(DeleteMemPointHandler))
	r.Handle("/addCommentPoint", c.Handler(AddCommentPointHandler))
	r.Handle("/deleteCommentPoint", c.Handler(DeleteCommentPointHandler))
	r.Handle("/addView", c.Handler(AddViewHandler))
	r.Handle("/deleteComment/{id}", c.Handler(DeleteCommentHandler))

	fs := justFilesFilesystem{http.Dir("resources/")}
	http.Handle("/resources/", http.StripPrefix("/resources", http.FileServer(fs)))
	http.Handle("/", handlers.LoggingHandler(os.Stdout, r))
	http.ListenAndServe(":8080", nil)
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
	vars := mux.Vars(req)
	mem := getMem(vars["id"], req.Header.Get("nickname"))
	comments := getComments(vars["id"], req.Header.Get("nickname"))
	memView := MemView{
		Comments: comments,
		Mem:      mem,
	}
	payload, _ := json.Marshal(memView)
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
	//Dodawanie mema
	var nickname = req.FormValue("nickname")
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
	var author = req.FormValue("author")
	var extension = req.FormValue("extension")
	var category = req.FormValue("category")
	datetime := time.Now().Format(time.RFC3339)
	result, err2 := db.Exec(
		"INSERT INTO mem (signature, imgExt, dateTime, authorNickname, category) VALUES ('" +
			title + "', '." + extension + "', '" + datetime + "', '" + author + "', '" + category + "')",
	)
	if err2 != nil {
		fmt.Println(err2.Error())
	}
	memID, err6 := result.LastInsertId()
	if err6 != nil {
		fmt.Println(err6)
	}

	//Dodawanie komentarza
	var profilePicture = req.FormValue("profilePicture")
	var comment = req.FormValue("comment")
	result2, errComment := db.Exec(
		"INSERT INTO comment (memId, authorNickname, authorPhoto, content, dateTime) VALUES ('" +
			strconv.FormatInt(memID, 10) + "', '" + author + "', '" + profilePicture + "', '" + comment + "', '" + datetime + "')",
	)
	if errComment != nil {
		fmt.Println(errComment.Error())
	}
	commentID, errCommentID := result2.LastInsertId()
	if errCommentID != nil {
		fmt.Println(errCommentID)
		fmt.Println(commentID)
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
	var nickname = req.FormValue("nickname")
	var profilePicture = req.FormValue("profilePicture")
	var comment = req.FormValue("comment")
	result, errComment := db.Exec(
		"INSERT INTO comment (memId, authorNickname, authorPhoto, content, dateTime) VALUES ('" +
			memID + "', '" + nickname + "', '" + profilePicture + "', '" + comment + "', '" + datetime + "')",
	)
	var success = true

	if errComment != nil {
		fmt.Println(errComment.Error())
		fmt.Println(result)
		success = false
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

var DeleteCommentHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	var reqId = vars["id"]
	var success = true
	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}
	_, err3 :=
		db.Query("DELETE FROM commentPoint WHERE commentId=" + reqId)
	if err3 != nil {
		fmt.Println(err3)
		return
	}
	_, err4 :=
		db.Query("DELETE FROM comment WHERE id=" + reqId)
	if err4 != nil {
		fmt.Println(err4)
		success = false
	}
	//Wysylanie odpowiedzi
	payload, _ := json.Marshal(success)
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
	defer db.Close()
})

var DeleteCommentPointHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	var success = true

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

var AddCommentPointHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	var success = true

	//Dodawanie pointa
	dateTime := time.Now().Format(time.RFC3339)
	var commentID = req.FormValue("commentID")
	var authorNickname = req.FormValue("authorNickname")
	var memID = req.FormValue("memId")
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
		success = false
	} else {
		result, errComment := db.Exec(
			"INSERT INTO commentPoint (commentId, authorNickname, dateTime, memId) VALUES ('" +
				commentID + "', '" + authorNickname + "', '" + dateTime + "', '" + memID + "')",
		)
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

var AddViewHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	//DataBase connection
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(db)
	}

	var success = true
	var memID = req.FormValue("memID")
	var mem = getMem(memID, req.Header.Get("nickname"))
	var views = mem.Views + 1
	//Update
	update, errUpdate := db.Exec("UPDATE mem SET views=" + strconv.Itoa(views) + " WHERE id=" + memID)
	if errUpdate != nil {
		fmt.Println(errUpdate)
		fmt.Println(update)
		success = false
	}
	//Wysylanie odpowiedzi
	payload, _ := json.Marshal(success)
	w.Write([]byte(payload))
	defer db.Close()
})
