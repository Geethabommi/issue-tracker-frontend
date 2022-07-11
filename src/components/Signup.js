import React, { Component } from 'react';
import Projects from './Projects';
import issueIcon from './assets/images/issue-icon.png';
import './assets/Login.css';
import $ from 'jquery';

const API_URL = process.env.REACT_APP_API_URL;

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      signupEmail: '',
      signupPassword: '',
      currentUser: {},
      errorMsg: '',
      successMsg: '',
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

  userSignupHandler = async (e) => {
    e.preventDefault();
    this.setState({ errorMsg: '', successMsg: '' });
    $('#liveSuccessToast').hide();
    $('#liveToast').hide();
    const { signupEmail, signupPassword } = this.state;
    if (signupEmail && signupPassword) {
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
        if (parsedResponse.msg == 'Signup successful') {
          this.setState(
            { successMsg: 'Sign up successfully,Please Login' },
            () => {
              console.log('show toast');
              $('#liveSuccessToast').show();
            }
          );
          setTimeout(() => {
            this.props.history.push('/login');
          }, 2000);
        } else if (
          parsedResponse.msg == 'User already exists with this email'
        ) {
          this.setState(
            {
              errorMsg: parsedResponse.msg,
            },
            () => {
              console.log('show toast');
              $('#liveToast').show();
            }
          );
        } else {
          this.setState(
            {
              errorMsg:
                'Sign up not successful.please try again after sometime ',
            },
            () => {
              console.log('show toast');
              $('#liveToast').show();
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      this.setState({ errorMsg: 'Email or password is not valid ' }, () => {
        console.log('show toast');
        $('#liveToast').show();
      });
    }
  };

  hidetoast = () => {
    console.log('hide toast');
    $('#liveToast').hide();
  };

  render() {
    const { email, password, signupEmail, signupPassword, currentUser } =
      this.state;

    return (
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

                      <form onSubmit={this.userSignupHandler}>
                        <p>Please Sign up for new account</p>

                        <div class='form-outline mb-4'>
                          <input
                            type='email'
                            id='form2Example11'
                            class='form-control'
                            placeholder='Email address'
                            value={signupEmail}
                            onChange={this.setUserSignupEmail}
                          />
                        </div>

                        <div class='form-outline mb-4'>
                          <input
                            type='password'
                            id='form2Example22'
                            class='form-control'
                            placeholder='password'
                            value={signupPassword}
                            onChange={this.setUserSignupPassword}
                          />
                        </div>

                        <div class='text-center pt-1 mb-5 pb-1'>
                          <button
                            class='btn btn-primary btn-block fa-lg gradient-custom-2 mb-3'
                            type='submit'
                          >
                            Sign up
                          </button>
                        </div>
                        <div class='d-flex align-items-center justify-content-center pb-4'>
                          <button
                            type='button'
                            class='btn btn-outline-danger'
                            onClick={() => {
                              this.props.history.push('/login');
                            }}
                          >
                            Already have an account?
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

        <div class='position-fixed bottom-0 end-0 p-3' style={{ zIndex: '11' }}>
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

        <div class='position-fixed bottom-0 end-0 p-3' style={{ zIndex: '11' }}>
          <div
            id='liveSuccessToast'
            class='toast hide'
            role='alert'
            aria-live='assertive'
            aria-atomic='true'
          >
            <div class='toast-header'>
              <strong class='me-auto'>Success</strong>
              <button
                type='button'
                class='btn-close'
                data-bs-dismiss='toast'
                aria-label='Close'
                onClick={hideSuccesstoast}
              ></button>
            </div>
            <div class='toast-body'>{successMsg}</div>
          </div>
        </div>
      </section>
    );
  }
}

export default Signup;
