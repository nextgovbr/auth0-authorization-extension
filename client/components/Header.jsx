import React, { Component, PropTypes } from 'react';
import './Header.styl';

export default class Header extends Component {
  static propTypes = {
    user: PropTypes.object,
    issuer: PropTypes.string,
    onLogout: PropTypes.func.isRequired,
    openAPI: PropTypes.func.isRequired,
    openConfiguration: PropTypes.func.isRequired
  };

  getPicture(iss) {
    return ``;
  }

  render() {
    const { user, issuer, onLogout, openAPI, openConfiguration } = this.props;
    return (
      <header className="extension-header">
        <nav role="navigation" className="navbar navbar-default">
          <div className="container">
            <div className="extension-header-logo">
              <div className="auth0-logo" />
              <h1 className="extension-name">Controle de Acesso</h1>
            </div>
            <div id="navbar-collapse" className="collapse navbar-collapse">
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a href="https://prefeituras.net">Aprova Digital</a>
                </li>
                <li className="dropdown">
                  <span
                    role="button"
                    data-toggle="dropdown"
                    data-target="#"
                    className="btn-username"
                  >
                    <span className="username-text">{window.config.AUTH0_DOMAIN}</span>
                    <i className="icon-budicon-460 toggle-icon" />
                  </span>
                  <ul role="menu" className="dropdown-menu">
                    <li role="presentation" className="divider" />
                    <li role="presentation">
                      <a role="menuitem" tabIndex="-1" onClick={onLogout}>
                        Sair
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}
