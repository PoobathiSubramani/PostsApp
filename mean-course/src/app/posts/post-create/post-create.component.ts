import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../post.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

//dummy comment

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
  form: FormGroup;
  imagePreview: string;



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
    this.form = new FormGroup({
      title: new FormControl(null, { //null works only for the new posts. for edits, set it in subscribe
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required],
        asyncValidators: [mimeType]})

    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postID')) {
        this.mode='edit';
        this.postID = paramMap.get('postID');
        this.isLoading=true; //we set this here to show the spinner until it loads
        this.postService.getPostForEdit(this.postID)
          .subscribe(postData => {
            this.isLoading=false; //when we are inside the subscription, we must be done loading
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath
            };
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });
          })

      } else {
        this.mode='create';
        this.postID = null;
      }
    });
  }

  onImagePicked(event: Event) {
    /*
    Event is a default type provided by TS outofthebox cuz its a default JS type
    */
    //The problem just is Typescript doesn't know that our event target actually is an input, a file input and therefore
    //it doesn't know that this file's property exists so typecasting it to the HTMLInputElement and then use the files property
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file}); //patchvalue is used to update only a specific control in the FromGroup
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);

    //create image preview
    //1.get the url
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if(this.form.invalid){
      return;
    }
    if(this.mode === 'create') {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    } else {
      this.postService.updatePost(
        this.postID,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    }
    this.form.reset();
  }
/*
  public onAddPost() {

    if(this.form.invalid) {
      return;
    }

    this.postService.addPost(this.form.value.title, this.form.value.content);
    this.form.resetForm();
  }

  public onClearPost(form: NgForm) {
    return form;
  }
  */

}
