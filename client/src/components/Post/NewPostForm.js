import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { addPost, getPosts } from "../../actions/postAction";
import { isEmpty, timeStampParser } from "../Utils";

const NewPostForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [postPicture, setPostPicture] = useState(null);
  const [video, setVideo] = useState("");
  const [file, setFile] = useState();
  const userData = useSelector((state) => state.rootReducer.userReducer);
  const errors = useSelector(
    (state) => state.rootReducer.errorsReducer.postError
  );
  const dispatch = useDispatch();

  const handlePost = async () => {
    try {
      if (message || postPicture || video) {
        const data = new FormData();
        data.append("posterId", userData._id);
        data.append("message", message);
        if (file) data.append("file", file);
        data.append("video", video);

        await dispatch(addPost(data));
        dispatch(getPosts());
        cancelPost();
      } else {
        alert("Veuillez écrire un message");
      }
    } catch (err) {
      return console.log(err);
    }
  };

  const handlePicture = (e) => {
    setPostPicture(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
    setVideo("");
  };

  const cancelPost = () => {
    setMessage("");
    setPostPicture("");
    setVideo("");
    setFile("");
  };

  useEffect(() => {
    if (!isEmpty(userData)) setIsLoading(false);

    //fonction pour traiter la vidéo dans le message poster
    const handleVideo = () => {
      //le split sert à séparer chaque élément mis dans message afin de traiter les éléments séparement
      let findLink = message.split(" ");
      //ensuite on fait une boucle fort pour passer en revue tous les éléments
      for (let i = 0; i < findLink.length; i++) {
        //si un des éléments de la boucle comporte le début des liens suivants(voir string)
        if (
          findLink[i].includes("https://www.yout") ||
          findLink[i].includes("https://yout")
        ) {
          //on remplace le watch par embed pour que la vidéo soit lisibe dans un lecteur en dehors de YT
          let embed = findLink[i].replace("watch?v=", "embed/");
          //ensuite on enlève tous ce qui est après le & dans l'url car cela correspond à des time code de la vidéo
          setVideo(embed.split("&")[0]);
          //pour finir on supprime le message qui se trouve dans le post avec le splice (i,1)
          findLink.splice(i, 1);
          setMessage(findLink.join(" "));
          setPostPicture("");
        }
      }
    };
    handleVideo();
  }, [userData, message]);

  return (
    <div className="post-container">
      {isLoading ? (
        <i className="fas fa-spinner fa-pulse"></i>
      ) : (
        <>
          <div className="data">
            <p>
              <span>{userData.following ? userData.following.length : 0}</span>{" "}
              Abonnement
              {userData.following && userData.following.length > 1 ? "s" : null}
            </p>
            <p>
              <span>{userData.followers ? userData.followers.length : 0}</span>{" "}
              Abonné
              {userData.followers && userData.followers.length > 1 ? "s" : null}
            </p>
          </div>
          <NavLink exact to="/profil">
            <div className="user-info">
              <img src={userData.picture} alt="user img" />
            </div>
          </NavLink>
          <div className="post-form">
            <textarea
              name="message"
              id="message"
              placeholder="Quoi de neuf ?"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            {message || postPicture || video.length > 20 ? (
              <li className="card-container">
                <div className="card-left">
                  <img src={userData.picture} alt="user pic" />
                </div>
                <div className="card-right">
                  <div className="card-header">
                    <div className="pseudo">
                      <h3>{userData.pseudo}</h3>
                    </div>
                    <span>{timeStampParser(Date.now())}</span>
                  </div>
                  <div className="content">
                    <p>{message}</p>
                    <img src={postPicture} alt="" />
                    {video && (
                      <iframe
                        src={video}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video}
                      ></iframe>
                    )}
                  </div>
                </div>
              </li>
            ) : null}
            <div className="footer-form">
              <div className="icon">
                {isEmpty(video) && (
                  <>
                    <img src="./img/icons/picture.svg" alt="img" />
                    <input
                      type="file"
                      id="file-upload"
                      name="file"
                      accept=".png, .jpg, .jpeg"
                      onChange={(e) => handlePicture(e)}
                    />
                  </>
                )}
                {video && (
                  <button onClick={() => setVideo("")}>
                    supprimer la vidéo
                  </button>
                )}
              </div>
              {!isEmpty(errors.format) && <p>{errors.format}</p>}
              {!isEmpty(errors.maxSize) && <p>{errors.maxSize}</p>}
              <div className="btn-send">
                {message || postPicture || video.length > 20 ? (
                  <button className="cancel" onClick={cancelPost}>
                    annuler le message{" "}
                  </button>
                ) : null}
                <button className="send" onClick={handlePost}>
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NewPostForm;
