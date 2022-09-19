import axios from "axios";

// posts

export const GET_POSTS = "GET_POSTS";
export const GET_ALL_POSTS = "GET_ALL_POSTS";
export const ADD_POST = "ADD_POST";
export const LIKE_POSTS = "LIKE_POSTS";
export const UNLIKE_POSTS = "UNLIKE_POSTS";
export const UPDATE_POSTS = "UPDATE_POSTS";
export const DELETE_POSTS = "DELETE_POSTS";

// comments

export const ADD_COMMENTS = "ADD_COMMENTS";
export const EDIT_COMMENTS = "EDIT_COMMENTS";
export const DELETE_COMMENTS = "DELETE_COMMENTS";

//trends
export const GET_TRENDS = "GET_TRENDS";

//errors
export const GET_POST_ERRORS = "GET_POST_ERRORS";

export const getPosts = (num) => {
  return (dispatch) => {
    return axios
      .get(`${process.env.REACT_APP_API_URL}api/post/`)
      .then((res) => {
        const array = res.data.slice(0, num);
        dispatch({ type: GET_POSTS, payload: array });
        dispatch({ type: GET_ALL_POSTS, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};

export const addPost = (data) => {
  return (dispatch) => {
    return axios
      .post(`${process.env.REACT_APP_API_URL}api/post/`, data)
      .then((res) => {
        if (res.data.errors) {
          dispatch({ type: GET_POST_ERRORS, payload: res.data.errors });
        } else {
          dispatch({ type: GET_POST_ERRORS, payload: "" });
        }
      });
  };
};

export const likePosts = (postId, userId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/post/like-post/` + postId,
      data: { id: userId },
    })
      .then((res) => {
        dispatch({ type: LIKE_POSTS, payload: { postId, userId } });
      })
      .catch((err) => console.log(err));
  };
};

export const unlikePosts = (postId, userId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/post/unlike-post/` + postId,
      data: { id: userId },
    })
      .then((res) => {
        dispatch({ type: UNLIKE_POSTS, payload: { postId, userId } });
      })
      .catch((err) => console.log(err));
  };
};

export const updatePosts = (postId, message) => {
  return (dispatch) => {
    return axios({
      method: "put",
      url: `${process.env.REACT_APP_API_URL}api/post/${postId}`,
      data: { message },
    })
      .then((res) => {
        dispatch({ type: UPDATE_POSTS, payload: { message, postId } });
      })
      .catch((err) => console.log(err));
  };
};

export const deleteposts = (postId) => {
  return (dispatch) => {
    return axios({
      method: "delete",
      url: `${process.env.REACT_APP_API_URL}api/post/${postId}`,
    })
      .then((res) => {
        dispatch({ type: DELETE_POSTS, payload: { postId } });
      })
      .catch((err) => console.log(err));
  };
};

//action pour les comments

//Voir CardComments => handleComments
//on créer cette fonction pour ajouter les comments MAIS étant donné que les comments sont un tableau dans un tableau
//ET que c'est mongoDB qui créé l'id du nouveau comment, on ne doit pas faire de reducer
//CAR on doit aller intéroger la DB pour connaitre l'id
export const addComments = (postId, commenterId, text, commenterPseudo) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/post/comment-post/${postId}`,
      data: { commenterId, text, commenterPseudo },
    })
      .then((res) => {
        dispatch({ type: ADD_COMMENTS, payload: { postId } });
      })
      .catch((err) => console.log(err));
  };
};

export const editComments = (postId, commentId, text) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/post/edit-comment-post/${postId}`,
      data: { commentId, text },
    })
      .then((res) => {
        dispatch({ type: EDIT_COMMENTS, payload: { postId, commentId, text } });
      })
      .catch((err) => console.log(err));
  };
};

export const deleteComments = (postId, commentId) => {
  return (dispatch) => {
    return axios({
      method: "patch",
      url: `${process.env.REACT_APP_API_URL}api/post/delete-comment-post/${postId}`,
      data: { commentId },
    })
      .then((res) => {
        dispatch({ type: DELETE_COMMENTS, payload: { postId, commentId } });
      })
      .catch((err) => console.log(err));
  };
};

export const getTrends = (sortedArray) => {
  return (dispatch) => {
    dispatch({ type: GET_TRENDS, payload: sortedArray });
  };
};
