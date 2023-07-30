import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Message } from "../model/message";
import { tap } from "rxjs/operators";
import { MessagesService } from "./messages.service";

@Component({
  selector: "messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.css"],
})
export class MessagesComponent implements OnInit {
  showMessages = false;

  constructor(private messagesService: MessagesService) {}

  errors$ = this.messagesService.errors$.pipe(
    tap(() => (this.showMessages = true))
  );

  ngOnInit() {}

  onClose() {
    this.showMessages = false;
  }
}
