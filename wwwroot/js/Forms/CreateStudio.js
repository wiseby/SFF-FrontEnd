

export default class CreateStudioForm {
  
  name;
  password;
  location;
  
  
  constructor() {
    
  }

  render = function createStudioInput() {
    let content = `
    <fieldset class="input-group">
      <legend>Register Studio</legend>
      <input for="name" type="text" placeholder="Name..." id="name">
      <input for="location" type="text" placeholder="Location..." id="location">
      <input for="password" type="password" placeholder="Password..." id="password">
      <button class="submit" id="create-studio">Register</button>
    </fieldset>
    `;

  }
}