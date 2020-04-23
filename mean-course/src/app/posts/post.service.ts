import {Post} from './post.model'
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
//map operator can be used to map data items on the observables
import { map, mapTo } from 'rxjs/operators';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import {Router} from '@angular/router'

@Injectable({providedIn: 'root'}) //this is easier way to expose the class to outside

export class PostsService {
  private posts: Post[] = []; //this is made private becuase this should not be editable from outside

  private postsUpdated = new Subject<Post[]>(); //<> specifis that the subject will get passed with Post[]

  //this post cannot be accessed from other file so create a method to do that

  constructor(private http: HttpClient, private router: Router) {};

  getPost() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')

      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        });
      }))

      .subscribe(transformedPosts => {
        this.posts = transformedPosts; //this assignment will get the json content into the post variables automatically by get
        //now we got the values in the posts, we need to inform our app (java parts of app) abt this update
        this.postsUpdated.next([...this.posts]);
        console.log(transformedPosts);
      });
  }

  getPostForEdit(id: string) {
    //return {...this.posts.find(p => p.id === id)};
    return this.http.get<{_id: string, title:string, content: string}>('http://localhost:3000/api/posts/' + id);
  };

  getPostUpdatedListener() { //this method is required to return the postsUpdated as it was declared as private
    return this.postsUpdated.asObservable();
    //this will sort of emit the posts and that will have to be listened somewhere
    // - list-component.ts -> ngOnInit() - using Subscribe()
  };

  addPost(title: string, content: string, image: File) {
    const post: Post = {
      id: null,
      title: title,
      content: content,
      imagePath: null // boo added this. check later
    }; //create a new post variables of type Post

    //earlier the post was having only the json data. now with the image to be uploaded, we do the following
    //create a variable of type form data
    const postData = new FormData(); //this allows to combine text as well as blob
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);


    //seding post to the server
    this.http.post<{message: string, post: Post}>(
      'http://localhost:3000/api/posts',
      postData)
    .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };

        console.log(responseData.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]) //this is sort of emitting whenever we add a post through addPost()

        this.router.navigate(["/"]);
    });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id: id, title: title, content: content, imagePath: null};
    this.http.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        console.log(response);

        this.router.navigate(["/"]);
      });
  }

  deletePost(postID: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postID)
      .subscribe(() => {
        //console.log('Post Service: Post deleted in the app!');
        const undeletedPosts = this.posts.filter(post => post.id !== postID);
        this.posts = undeletedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  clearPost(form: NgForm){
    form.reset;
  };

}
