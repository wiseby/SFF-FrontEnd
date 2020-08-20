

export default class CreateStudioForm {
  
  name;
  password;
  verified;
  
  
  constructor() {
    
  }

  render = function createStudioInput() {
    let content = `
    <fieldset class="input-group">
      <legend>Register Studio</legend>
      <input for="name" type="text" placeholder="Name..." id="name">
      <input for="password" type="password" placeholder="Password..." id="password">
      <button class="submit" id="create-studio">Register</button>
    </fieldset>
    `;

  }
}