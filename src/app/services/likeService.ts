/**
 * Created by bubble on 19.05.16.
 */
import {Injectable} from "angular2/core";
import {Likes} from "../components/entities/like";
import {DisplayTag} from '../components/entities/DisplayTag';
import * as _ from "lodash";
import Dictionary = _.Dictionary;
import User = __Backendless.User;
import {Tag} from "../components/entities/tag";
import {Place} from "../components/entities/place";
const Backendless = require('backendless');


@Injectable()
export class LikeService {
  like:Likes;

  constructor() {
  }

  getLikedTags(placeID:string) {
    let query = new Backendless.DataQuery();
    query.condition = "place.objectId='" + placeID + "'";
    query.options = { relations: ["tag"] };
    return Backendless.Persistence.of(Likes).find(query).
    then(res => res.data.map((like) => like.tag))
      .then(tags => {
        let displayTags = [];
        let tagsCount = _.groupBy(tags, "objectId");
        for (let key in tagsCount) {
          displayTags.push(new DisplayTag(tagsCount[key][0], tagsCount[key].length))
        }
        return displayTags;
      });
  }

  addLike(place: Place, tag: Tag) {
    var currentUser = Backendless.UserService.getCurrentUser()
      .then(user=>new Likes(place, user, tag))
      .then((like)=>Backendless.Persistence.of(Likes).save(like));
  }

}
