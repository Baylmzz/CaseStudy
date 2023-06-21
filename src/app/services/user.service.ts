import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { UserModel } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { stringify } from 'postcss';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = new BehaviorSubject<UserModel | any>(null);
  currentUser = this.user.asObservable();
  private isEditing = new BehaviorSubject<boolean>(false);
  currentIsEditing = this.isEditing.asObservable();
  users$: Observable<UserModel[]>;
  
  constructor(private firestore: Firestore) {
    this.getAll()
  }
  
  changeUser(user: UserModel) {
    this.user.next(user);
  };

  changeIsEditing(isEditing: boolean){
    this.isEditing.next(isEditing);
  };

  async addUser(userModel: UserModel): Promise<any> {
    const userCollection = collection(this.firestore, 'users');
    return addDoc(userCollection, userModel);
  }
  getAll(){
    const userCollection = collection(this.firestore, 'users');
    this.users$ = collectionData(userCollection, {idField: "id"}) as Observable<UserModel[]>;
  }

  async updateUser(userModel: UserModel, id:string){
    const userInstance = doc(this.firestore, 'users', id)
    return updateDoc(userInstance, userModel as any)
  }

  async deleteUser(id:string){
    const userInstance = doc(this.firestore, 'users', id)
    return deleteDoc(userInstance)
  }
}
