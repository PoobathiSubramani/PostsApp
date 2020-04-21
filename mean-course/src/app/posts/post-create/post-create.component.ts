import { Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../post.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';



@Component( {
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
} )
export  class PostCreateComponent implements OnInit{
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  private mode = 'create';
  private postID: string;
  isLoading = false;



  //enteredValue='';
  //newPost = 'Add some content here...';
  //postCreated = new EventEmitter(); this is not needed as we are using services to listen in

  //add the constructor to listen in as we did in the list-component.ts
  constructor (public postService: PostsService, public route: ActivatedRoute){}
  /*
  in the above constructor, ActivatedRoute is included to get the router information (angular)
  that will help to identife in which page should be in and what to do
  ex: if the router contains only /edit then we are in create page
  when the edit/ contains a param (postID) then we are on that post's edit page
  */

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postID')) {
        this.mode='edit';
        this.postID = paramMap.get('postID');
        this.isLoading=true; //we set this here to show the spinner until it loads
        this.postService.getPostForEdit(this.postID)
          .subscribe(postData => {
            this.isLoading=false; //when we are inside the subscription, we must be done loading
            this.post = {id: postData._id, title: postData.title, content: postData.content};

          })

      } else {
        this.mode='create';
        this.postID = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if(form.invalid){
      return;
    }
    if(this.mode === 'create') {
      this.postService.addPost(form.value.title, form.value.content);
    } else {
      this.postService.updatePost(this.postID, form.value.title, form.value.content);
    }
    form.resetForm();
  }

  public onAddPost(form: NgForm) {

    if(form.invalid) {
      return;
    }

    this.postService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }

  public onClearPost(form: NgForm) {
    return form;
  }

}
