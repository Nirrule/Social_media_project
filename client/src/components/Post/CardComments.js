import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComments, getPosts } from "../../actions/postAction";
import FollowHandler from "../profil/FollowHandler";
import { isEmpty, timeStampParser } from "../Utils";
import EditDeleteComments from "./EditDeleteComments";

const CardComments = ({ post }) => {
  const [text, setText] = useState("");
  const usersData = useSelector((state) => state.rootReducer.usersReducer);
  const userData = useSelector((state) => state.rootReducer.userReducer);
  const dispatch = useDispatch();

  const handleComment = (e) => {
    e.preventDefault();

    //et du coup ici on récupére tout les posts avec le getPosts pour trouver l'id unique du nouvau post avec le dispatch fait avant
    if (text) {
      dispatch(addComments(post._id, userData._id, text, userData.pseudo))
        .then(() => dispatch(getPosts()))
        .then(() => setText(""));
    }
  };

  return (
    <div className="comments-container">
      {post.comments.map((comment) => {
        return (
          <div
            className={
              comment.commenterId === userData._id
                ? "comment-container client"
                : "comment-container"
            }
            key={comment._id}
          >
            <div className="left-part">
              <img
                src={
                  !isEmpty(usersData[0]) &&
                  usersData
                    .map((user) => {
                      if (user._id === comment.commenterId) return user.picture;
                      else return null;
                    })
                    .join("")
                }
                alt="commenter-pic"
              />
            </div>
            <div className="right-part">
              <div className="comment-header">
                <div className="pseudo">
                  <h3>{comment.commenterPseudo}</h3>
                  {comment.commenterId !== userData._id && (
                    <FollowHandler
                      idToFollow={comment.commenterId}
                      type={"card"}
                    />
                  )}
                </div>
                <span>{timeStampParser(comment.timestamp)}</span>
              </div>
              <p>{comment.text}</p>
              <EditDeleteComments comment={comment} postId={post._id} />
            </div>
          </div>
        );
      })}
      {userData._id && (
        <form className="comment-form" onSubmit={handleComment}>
          <input
            type="text"
            name="text"
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="écrire un commentaire"
          />
          <br />
          <input type="submit" value="envoyer" />
        </form>
      )}
    </div>
  );
};

export default CardComments;
