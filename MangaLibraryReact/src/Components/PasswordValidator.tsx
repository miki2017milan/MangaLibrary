export default function PasswordValidator({ password }: { password: string }) {
  return (
    <ul>
      <li>
        <img src={password.match(/^.{8,}$/) ? "valid.png" : "invalid.png"} alt="" />
        <p>Atleast 8 character</p>
      </li>
      <li>
        <img src={password.match(/^.*[A-Z].*$/) ? "valid.png" : "invalid.png"} alt="" />
        <p>Atleast one capital letter</p>
      </li>
      <li>
        <img src={password.match(/^.*[a-z].*$/) ? "valid.png" : "invalid.png"} alt="" />
        <p>Atleast one uncapitalized letter</p>
      </li>
      <li>
        <img src={password.match(/^.*[0-9].*$/) ? "valid.png" : "invalid.png"} alt="" />
        <p>Atleast one number</p>
      </li>
      <li>
        <img
          src={password.match(/^.*[\!\*\%\#\@\&\^\$\;\:\.\,\§].*$/) ? "valid.png" : "invalid.png"}
          alt=""
        />
        <p>Atleast one special character (!*%#@&^$;:.,§)</p>
      </li>
    </ul>
  );
}
