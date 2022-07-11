import React, { Component } from 'react';
import Projects from './Projects';
import './assets/Login.css';
import issueIcon from './assets/images/issue-icon.png';
import $ from 'jquery';

const API_URL = process.env.REACT_APP_API_URL;

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      signupEmail: '',
      signupPassword: '',
      currentUser: {},
      errorMsg: '',
    };
  }

  setUserEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  setUserPassword = (e) => {
    this.setState({ password: e.target.value });
  };

  setUserSignupEmail = (e) => {
    this.setState({ signupEmail: e.target.value });
  };

  setUserSignupPassword = (e) => {
    this.setState({ signupPassword: e.target.value });
  };

  userSigninHandler = async (e) => {
    e.preventDefault();

    const { email, password } = this.state;
    console.log(email && password);
    if (email && password) {
      let userObj = {
        email,
        password,
      };

      try {
        this.setState({ errorMsg: '' });

        let response = await fetch(`${API_URL}/user/login`, {
          method: 'POST',
          body: JSON.stringify(userObj),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        let parsedResponse = await response.json();
        console.log('>>>', parsedResponse);
        if (parsedResponse.msg == 'Login successful') {
          console.log(this.props.history);
          await localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify(parsedResponse.details)
          );
          this.props.history.push('/projects', {
            currentUser: parsedResponse.details,
          });
        } else {
          this.setState({ errorMsg: 'Email or password is incorrect' }, () => {
            console.log('show toast');
            $('#liveToast').show();
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      this.setState({ errorMsg: 'Email or password is not valid' }, () => {
        console.log('show toast');
        $('#liveToast').show();
      });
    }
  };

  userSignupHandler = async (e) => {
    e.preventDefault();

    const { signupEmail, signupPassword } = this.state;

    let userObj = {
      signupEmail,
      signupPassword,
    };

    try {
      let response = await fetch(`${API_URL}/user/signup`, {
        method: 'POST',
        body: JSON.stringify(userObj),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let parsedResponse = await response.json();

      console.log('>>>', parsedResponse);
    } catch (error) {
      console.log(error);
    }
  };

  handleSignup = () => {
    this.props.history.push('/signup');
  };
  hidetoast = () => {
    console.log('hide toast');
    $('#liveToast').hide();
  };
  render() {
    console.log('login prop', this.props);
    const { email, password, signupEmail, signupPassword, currentUser } =
      this.state;

    return (
      <>
        <section class='h-100 gradient-form'>
          <div class='container py-5 h-100'>
            <div class='row d-flex justify-content-center align-items-center h-100'>
              <div class='col-xl-10'>
                <div class='card rounded-3 text-black'>
                  <div class='row g-0'>
                    <div class='col-lg-6'>
                      <div class='card-body p-md-5 mx-md-4'>
                        <div class='text-center'>
                          <img
                            src={issueIcon}
                            style={{
                              width: '80px',
                              borderRadius: '50%',
                            }}
                            alt='logo'
                          />
                          <h4 class='mt-1 mb-5 pb-1'>Issue Tracker</h4>
                        </div>

                        <form onSubmit={this.userSigninHandler}>
                          <p>Please login to your account</p>

                          <div class='form-outline mb-4'>
                            <input
                              type='email'
                              id='form2Example11'
                              class='form-control'
                              placeholder='Email address'
                              value={email}
                              onChange={this.setUserEmail}
                            />
                          </div>

                          <div class='form-outline mb-4'>
                            <input
                              type='password'
                              id='form2Example22'
                              class='form-control'
                              placeholder='password'
                              value={password}
                              onChange={this.setUserPassword}
                            />
                          </div>

                          <div class='text-center pt-1 mb-5 pb-1'>
                            <button
                              class='btn btn-primary btn-block fa-lg gradient-custom-2 mb-3'
                              type='submit'
                            >
                              Log in
                            </button>
                          </div>

                          <div class='d-flex align-items-center justify-content-center pb-4'>
                            <p class='mb-0 me-2'>Don't have an account?</p>
                            <button
                              type='button'
                              class='btn btn-outline-danger'
                              onClick={this.handleSignup}
                            >
                              Create new
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div class='col-lg-6 d-flex align-items-center gradient-custom-2'>
                      <div class='text-white px-3 py-4 p-md-5 mx-md-4'>
                        <h4 class='mb-4'>Issue Tracker</h4>
                        <p class='small mb-0'>
                          Create and track projects , issues to make your work
                          easier , faster and cleaner!!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class='position-fixed bottom-0 end-0 p-3'
            style={{ zIndex: '11' }}
          >
            <div
              id='liveToast'
              class='toast hide'
              role='alert'
              aria-live='assertive'
              aria-atomic='true'
            >
              <div class='toast-header'>
                <strong class='me-auto'>Error</strong>
                <button
                  type='button'
                  class='btn-close'
                  data-bs-dismiss='toast'
                  aria-label='Close'
                  onClick={this.hidetoast}
                ></button>
              </div>
              <div class='toast-body'>{this.state.errorMsg}</div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default Login;
