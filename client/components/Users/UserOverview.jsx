import React from 'react';
import { findDOMNode } from 'react-dom';
import { Button, ButtonToolbar, Nav, NavItem, Tabs, Tab } from 'react-bootstrap';
import {
  Pagination,
  SectionHeader,
  BlankState,
  SearchBar,
  Error,
  TableTotals,
  LoadingPanel
} from 'auth0-extension-ui';

import UserGeneral from './UserGeneral';
import UserFederated from './UserFederated';
import UsersTable from './UsersTable';
import UserIcon from '../Icons/UsersIcon';

class UserOverview extends React.Component {
  constructor() {
    super();

    this.searchBarOptions = [
      {
        value: 'user',
        title: 'Nome',
        filterBy: ''
      },
      {
        value: 'email',
        title: 'E-mail',
        filterBy: 'email'
      },
      {
        value: 'connection',
        title: 'Cidade',
        filterBy: 'identities.connection'
      }
    ];

    this.state = {
      selectedFilter: this.searchBarOptions[0]
    };

    this.renderActions = this.renderActions.bind(this);
    this.handleUsersPageChange = this.handleUsersPageChange.bind(this);

    // Searchbar.
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onHandleOptionChange = this.onHandleOptionChange.bind(this);
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.props.onSearch(`${e.target.value}*`, this.state.selectedFilter.filterBy);
    }
  }

  onReset() {
    this.props.onReset();
  }

  onHandleOptionChange(option) {
    this.setState({
      selectedFilter: option
    });
  }

  handleUsersPageChange(page) {
    this.props.getUsersOnPage(page);
  }

  renderActions(user, index) {
    return this.props.renderActions(user, index);
  }

  renderEmptyState() {
    return (
      <BlankState
        title="Users"
        iconImage={
          <div className="no-content-image">
            <UserIcon />
          </div>
        }
        description="It looks like you don't have any users yet! You'll need users to sign up through Auth0 first before you can assign them to groups."
      >
        <a
          href="https://auth0.com/docs/extensions/authorization-extension"
          rel="noopener noreferrer"
          target="_blank"
          className="btn btn-transparent btn-md"
        >
          Read more
        </a>
      </BlankState>
    );
  }

  render() {
    const { loading, error, users, total, fetchQuery, renderActions } = this.props;

    if (!error && !users.length && !loading && ((!fetchQuery || !fetchQuery.length) && !total)) {
      return this.renderEmptyState();
    }

    return (
      <div>
        <Error message={error} />
        <SectionHeader title="Usuários" description="Abre um usuário e lhe de acesso." />

        <UserGeneral />
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-xs-12">
            <SearchBar
              placeholder="Busque por usuários"
              searchOptions={this.searchBarOptions}
              handleKeyPress={this.onKeyPress}
              handleReset={this.onReset}
              handleOptionChange={this.onHandleOptionChange}
            />
          </div>
        </div>

        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12">
              <UsersTable loading={loading} users={users} renderActions={renderActions} />
            </div>
          </div>
        </LoadingPanel>
        <div className="row">
          <div className="col-xs-12">
            {process.env.PER_PAGE < total ? (
              <Pagination
                totalItems={total}
                handlePageChange={this.handleUsersPageChange}
                perPage={process.env.PER_PAGE}
              />
            ) : (
              <TableTotals currentCount={users.length} totalCount={total} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

UserOverview.propTypes = {
  onReset: React.PropTypes.func.isRequired,
  onSearch: React.PropTypes.func.isRequired,
  error: React.PropTypes.object,
  users: React.PropTypes.array.isRequired,
  total: React.PropTypes.number.isRequired,
  loading: React.PropTypes.bool.isRequired,
  renderActions: React.PropTypes.func.isRequired,
  getUsersOnPage: React.PropTypes.func.isRequired
};

export default UserOverview;
