package main

import (
	"encoding/base64"
	"io/ioutil"
	"os"
	"path/filepath"
	"text/template"
)

type Page struct {
	Script string
	Logo   string
	Css    []string
}

func main() {
	tmpl, err := template.ParseFiles("src/index.html")
	if err != nil {
		panic(err)
	}

	script, err := ioutil.ReadFile("dist/bundle.js")
	if err != nil {
		panic(err)
	}

	image, err := ioutil.ReadFile("logo_small.png")
	if err != nil {
		panic(err)
	}

	encodedImage := base64.StdEncoding.EncodeToString(image)

	css := make([]string, 0)

	err = filepath.Walk("css/", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if filepath.Ext(path) != ".css" {
			return nil
		}

		c, err := ioutil.ReadFile(path)
		if err != nil {
			return err
		}

		css = append(css, string(c))

		return nil
	})

	if err != nil {
		panic(err)
	}

	page := Page{
		Script: string(script),
		Logo:   encodedImage,
		Css:    css,
	}

	f, err := os.Create("index.html")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	err = tmpl.ExecuteTemplate(f, "index.html", page)
	if err != nil {
		panic(err)
	}
}
