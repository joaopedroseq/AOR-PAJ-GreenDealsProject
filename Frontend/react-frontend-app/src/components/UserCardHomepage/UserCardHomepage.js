import { Link } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";

//Cartão de utilizador usado na página de admin
//recebe quatro props - o atributo USER - o próprio utilizador a que o cartão diz respeito
//e operações de deleteProducts, excludeUser e deleteUser
//tratadas no Admin e subsequentemente respetivos handles
const UserCard = ({ user }) => {

  return (
    <div className="user-card-homepage" >
      <Link to={`/profile?username=${user.username}`}>
      <img
        src={user.url}
        alt="Foto do Utilizador"
        className="user-photo-homepage"
        data-username={user.username}
      />
      {user.excluded ? <div className="excludedUser-overlay"></div> : ""}
      </Link>
      <div className="user-info-homepage">
        <p className={`username ${user.excluded ? "excluded-username" : ""}`}>{user.username}</p>
      </div>
      <div className="user-info-homepage">
        <p className={`username ${user.excluded ? "excluded-username" : ""}`}>{user.firstName} {user.lastName}</p>
      </div>
      <div className="user-info-homepage">
        <p className={`username ${user.excluded ? "excluded-username" : ""}`}>{user.products.length} produtos</p>
      </div>
      <Link to={`/chat?username=${user.username}`}>
        <FaPaperPlane/>
      </Link>
    </div>
  );
};

export default UserCard;