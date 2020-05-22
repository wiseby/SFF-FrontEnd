export class LoginForm extends HTMLElement {
  constructor() {
    }

  render = async function() {
    const response = await fetch('../../templates/login.html');
    const template = await response.text();

    this.innerHTML = "";    
  }
}