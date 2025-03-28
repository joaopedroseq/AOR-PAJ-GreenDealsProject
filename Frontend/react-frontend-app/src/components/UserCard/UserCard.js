import exclude from "../../assets/icons/exclude.png";
import deleteProducts from "../../assets/icons/deleteProducts.png";
import deleteUser from '../../assets/icons/deleteUser.png';
import { Link } from "react-router-dom";

const UserCard = ({ user, onDeleteProducts, onExcludeUser, onDeleteUser }) => {
  return (
    <div className="user-card" >
      <Link to={`/profile?username=${user.username}`}>
      <img
        src={user.url}
        alt="Foto do Utilizador"
        className="user-photo"
        data-username={user.username}
      />
      {user.excluded ? <div className="excludedUser-overlay"></div> : ""}
      </Link>
      <div className="user-info">
        <p className={`username ${user.excluded ? "excluded-username" : ""}`}>
          {user.username}
        </p>

        <p className="name">
          {user.firstName} {user.lastName} 
        </p>
        <p className="email">{user.email}</p>
        
        <img
          src={deleteProducts}
          alt="exclude user"
          className="deleteProductsUserBtn"
          data-username={user.username}
          onClick={onDeleteProducts}
        />
          <img
            src={exclude}
            alt="exclude user"
            className="excludeUserBtn"
            data-username={user.username}
            onClick={onExcludeUser}
          />
        <img
          src={deleteUser}
          alt="delete user"
          className="deleteUserBtn"
          onClick={onDeleteUser}
        />
      </div>
    </div>
  );
};

export default UserCard;