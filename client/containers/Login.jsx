import { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
class LoginContainer extends Component {
  async entrar(event) {
    event.preventDefault();
    console.log(
      document.getElementsByName('email')[0].value,
      document.getElementsByName('password')[0].value
    );
    let user = await axios
      .post(
        `/auth/api/v2/login`,
        {
          username: document.getElementsByName('email')[0].value,
          password: document.getElementsByName('password')[0].value
        },
        {
          responseType: 'json'
        }
      )
      .catch(err => {
        alert('Verifique seu usuário e senha.');
      });
    sessionStorage.setItem('authz:apiToken', user.data.access_token);
    location.href = '/';
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div
            style={{
              maxWidth: '480px',
              margin: '0 auto'
            }}
          >
            <img
              src="https://prefeituras.net/assets/images/prefeiturasazulescuro.png"
              style={{ maxWidth: '320px', marginBottom: '20px' }}
              alt=""
            />
            <div
              className="card"
              style={{
                borderRadius: '5px',
                border: '1px solid #efefef'
              }}
            >
              <div className="card-body" style={{ padding: '12px 32px' }}>
                <form onSubmit={this.entrar}>
                  <h3>
                    <div style={{ fontWeight: 'bold' }}> Seja bem vindo,</div> <br /> por favor
                    efetue seu login.
                  </h3>
                  <hr />
                  <input name="email" placeholder="E-mail" type="text" className="form-control" />
                  <br></br>
                  <input
                    name="password"
                    placeholder="Senha"
                    type="password"
                    className="form-control"
                  />
                  <hr />
                  <button type="submit" className="btn btn-primary">
                    Entrar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps,
  {}
)(LoginContainer);
