import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from '../post.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';


@Component( {
  selector: 'app-post-list',
  templateUrl: './list-component.html',
  styleUrls: ['./list-component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
/*
  posts = [
    {title: 'first post', content: 'first post\'s contents'},
    {title: 'second post', content: 'second post\'s contents'},
    {title: 'third post', content: 'third post\'s contents'}
  ]
*/

totalPosts = 10;
postsPerPage = 5;
pageSizeOptions = [1,2,5,10];
posts: Post[] =[];
private postSub: Subscription; //this is used to unsubscribe/delete the unused objects

constructor (public postService: PostsService) {
  //by making the postService public the constructor will initiate the objet and assign the PostsService to postService
  //this PostsService have to be added to the app module in the following three ways
  //1. add an entry in the Providers with import { PostsService } from './posts/post.service'
  //2.
}

ngOnInit() {
  this.postService.getPost();
  this.postSub = this.postService.getPostUpdatedListener()
    .subscribe( (posts: Post[]) => {
      this.posts = posts;
    });
}

onChangedPage(pageData: PageEvent) {
  console.log(pageData);
};

onDelete(postID: string) {
  this.postService.deletePost(postID);
}

ngOnDestroy() {
  this.postSub.unsubscribe(); //this will unsubscribe/delete the objects when they are not used to prevent memory leaks
}



}
