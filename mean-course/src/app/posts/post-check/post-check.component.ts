import { Component } from '@angular/core';
import {PostCreateComponent} from '../post-create/post-create.component'
import { PostsService } from '../post.service';


@Component( {
  selector: 'app-post-check',
  templateUrl: './post-check.component.html'
})


export class PostCheckComponent {


  checked=false;

  constructor (public postService: PostsService) {}






  onCheck() {
    if(this.checked) {
      alert(this.checked)
      //this.postService.clearPost();

    }

  }




}



