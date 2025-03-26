import exclude from "../../assets/icons/exclude.png";
import deleteProducts from "../../assets/icons/deleteProducts.png";
import deleteUser from '../../assets/icons/deleteUser.png';

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <img
        src={user.url}
        alt="Foto do Utilizador"
        className="user-photo"
        data-username={user.username}
      />
      {user.excluded ? <div className="excludedUser-overlay"></div> : ""}
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
        />
          <img
            src={exclude}
            alt="exclude user"
            className="excludeUserBtn"
            data-username={user.username}
          />
        <img
          src={deleteUser}
          alt="delete user"
          className="deleteUserBtn"
        />
      </div>
    </div>
  );
};

export default UserCard;