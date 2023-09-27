export class DeletedUserEvent {
  constructor(id: number) {
    this.id = id;
  }

  readonly id: number;
}
