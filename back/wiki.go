package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
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
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

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
	DateTime       time.Time
}

type Mem struct {
	ID             int
	Signature      string
	ImgExt         string
	DateTime       string
	AuthorNickname string
	Category       string
}

type MemView struct {
	Comments []Comment
	Mem      Mem
}

func getMems() []Mem {
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
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
	var slice []Mem
	for rows.Next() {
		err3 = rows.Scan(&ID, &Signature, &ImgExt, &DateTime, &AuthorNickname, &Category)
		mem := &Mem{
			ID:             ID,
			Signature:      Signature,
			ImgExt:         ImgExt,
			DateTime:       DateTime,
			AuthorNickname: AuthorNickname,
			Category:       Category,
		}
		fmt.Println(mem)
		slice = append(slice, *mem)
	}
	defer db.Close()
	return slice
}

func getMem(id string) Mem {
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
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
	for rows.Next() {
		err3 = rows.Scan(&ID, &Signature, &ImgExt, &DateTime, &AuthorNickname, &Category)
	}
	mem := Mem{
		ID:             ID,
		Signature:      Signature,
		ImgExt:         ImgExt,
		DateTime:       DateTime,
		AuthorNickname: AuthorNickname,
		Category:       Category,
	}
	defer db.Close()
	return mem
}

func getComments(id string) []Comment {
	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
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
	var DateTime time.Time
	var slice []Comment

	for rows.Next() {
		err3 = rows.Scan(&ID, &MemID, &AuthorNickname, &AuthorPhoto, &Content, &DateTime)
		comment := &Comment{
			ID:             ID,
			MemID:          MemID,
			AuthorNickname: AuthorNickname,
			AuthorPhoto:    AuthorPhoto,
			Content:        Content,
			DateTime:       DateTime,
		}
		slice = append(slice, *comment)
	}
	defer db.Close()
	return slice
}

func main() {
	// Here we are loading in our .env file which will contain our Auth0 Client Secret and Domain
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	r := mux.NewRouter()

	//r.HandleFunc("/home", homeHandler)
	r.Handle("/", http.FileServer(http.Dir("./views/")))
	c := cors.New(cors.Options{
		AllowedOrigins:     []string{"http://localhost:3000", "*"},
		OptionsPassthrough: true,
	})
	r.Handle("/mems", c.Handler(MemsHandler))
	r.Handle("/mem/{id}", c.Handler(MemHandler))
	r.Handle("/addMem", c.Handler(AddMemHandler))

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
	payload, _ := json.Marshal(getMems())
	if origin := r.Header.Get("Origin"); origin != "" {
		fmt.Println(origin)
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers",
			"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	}
	// Stop here if its Preflighted OPTIONS request
	/*
		if r.Method == "OPTIONS" {
			return
		}
	*/
	w.Write([]byte(payload))
	s.r.ServeHTTP(w, r)
}

var MemsHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	payload, _ := json.Marshal(getMems())
	w.Header().Set("Content-Type", "application/json")
	var origin = req.Header.Get("Origin")
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers",
		"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	w.Header().Set("Allow", "*")
	if req.Method == "OPTIONS" {
		return
	}
	w.Write([]byte(payload))
})

var MemHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	mem := getMem(vars["id"])
	comments := getComments(vars["id"])
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
		"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	w.Header().Set("Allow", "*")
	if req.Method == "OPTIONS" {
		return
	}
	w.Write([]byte(payload))
})

var AddMemHandler = http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	var title = req.FormValue("title")
	var author = req.FormValue("author")
	var extension = req.FormValue("extension")
	var category = req.FormValue("category")
	datetime := time.Now().Format(time.RFC3339)
	fmt.Println("title: " + title)
	fmt.Println("author: " + author)
	fmt.Println("extension: " + extension)
	fmt.Println("category: " + category)
	fmt.Println("dateTime: " + datetime)

	db, err := sql.Open("mysql", "root:Potoczek30@tcp/iidb")
	if err != nil {
		fmt.Println(err.Error())
	}

	result, err2 := db.Exec(
		"INSERT INTO mem (signature, imgExt, dateTime, authorNickname, category) VALUES ('" +
			title + "', '." + extension + "', '" + datetime + "', '" + author + "', '" + category + "')",
	)
	if err2 != nil {
		fmt.Println(err2.Error())
	}

	fmt.Println("result: ")
	fmt.Println()
	id, err6 := result.LastInsertId()
	if err6 != nil {
		fmt.Println(err6)
	}

	var comment = req.FormValue("description")
	fmt.Println("comment: " + comment)

	req.ParseMultipartForm(32 << 20)
	file, handler, err := req.FormFile("file")

	var success = true
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()
	fmt.Fprintf(w, "%v", handler.Header)
	var fileName = "./resources/mems/" + strconv.FormatInt(id, 10) + "." + extension
	f, err := os.OpenFile(fileName, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer f.Close()
	io.Copy(f, file)

	payload, _ := json.Marshal(success)
	w.Write([]byte(payload))
})
