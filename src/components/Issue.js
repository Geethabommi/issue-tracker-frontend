import React, { useState } from 'react';
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { labeloptions } from '../constants';
import './assets/Issues.css';
import dotLoader from './assets/images/dotloader.gif';
import $ from 'jquery';

const API_URL = process.env.REACT_APP_API_URL;

const Issues = (props) => {
  const [IsLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(
    props.location.state?.currentUser
  );
  const [currentProject, setcurrentProject] = useState(
    props.location.state?.currentProject
  );
  const [IssueTitle, setIssueTitle] = useState('');
  const [IssueDescription, setIssueDescription] = useState('');
  const [IssueLabel, setIssueLabel] = useState(labeloptions[0]);
  const [IssueAuthor, setIssueAuthor] = useState('');
  const [IssueList, setIssueList] = useState('');
  const [searchIssueTitle, setsearchIssueTitle] = useState('');
  const [searchIssueDesc, setsearchIssueDesc] = useState('');
  const [searchIssueLabel, setsearchIssueLabel] = useState('');
  const [searchIssueAuthor, setsearchIssueAuthor] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setsuccessMsg] = useState('');
  console.log(props);
  useMemo(() => {
    const user = JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )?.userID;
    if (!user) {
      localStorage.clear();
      props.history.push('/');
      return;
    }
  });
  console.log(IssueLabel, labeloptions[0]);
  const hidetoast = () => {
    console.log('hide toast');
    $('#liveToast').hide();
  };
  const showtoast = () => {
    console.log('Show toast');
    $('#liveToast').show();
  };
  const hideSuccesstoast = () => {
    console.log('hide Success toast');
    $('#liveSuccessToast').hide();
  };
  const showSuccesstoast = () => {
    console.log('Show Success toast');
    $('#liveSuccessToast').show();
  };
  const issueCreationHandler = async (e) => {
    e.preventDefault();
    hidetoast();
    hideSuccesstoast();
    let issueObj = {
      title: IssueTitle,
      description: IssueDescription,
      label: IssueLabel,
      user: currentUser?.userID,
      author: currentUser?.username,
      project: currentProject,
    };

    if (
      issueObj.title &&
      issueObj.user &&
      issueObj.description &&
      issueObj.label
    ) {
      try {
        setIsLoading(true);
        let response = await fetch(`${API_URL}/issue/create`, {
          method: 'POST',
          body: JSON.stringify(issueObj),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}`,
          },
        });

        let parsedResponse = await response.json();
        setIsLoading(false);
        console.log('>>>project created', parsedResponse);
        if (parsedResponse) {
          if (parsedResponse.message == 'Issue title already existed') {
            setErrorMsg('Issue title already exists');
            showtoast();
            return;
          } else if (parsedResponse.message == 'Issue created successfully!') {
            setsuccessMsg('Issue created Successfully');

            fetchAllIssues();
            clearIssueInputState();
            setTimeout(() => {
              showSuccesstoast();
            }, 2000);
          } else {
            setErrorMsg('Issue Not created.Please try again after sometime');
            showtoast();
            return;
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setErrorMsg('Please fill all the details to create issue');
      showtoast();
      return;
    }
  };

  const issueSearchHandler = async (e) => {
    e.preventDefault();
    hidetoast();
    hideSuccesstoast();
    let issueObj =
      'title=' +
      searchIssueTitle +
      '&description=' +
      searchIssueDesc +
      '&label=' +
      searchIssueLabel +
      '&author=' +
      searchIssueAuthor +
      '&project=' +
      currentProject;

    console.log(currentProject && currentUser?.userID);
    if (currentProject && currentUser?.userID) {
      if (
        searchIssueTitle ||
        searchIssueDesc ||
        searchIssueLabel ||
        searchIssueAuthor
      ) {
        try {
          setIsLoading(true);
          let response = await fetch(`${API_URL}/issue/search?${issueObj}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${currentUser.token}`,
            },
          });

          let parsedResponse = await response.json();
          setIsLoading(false);

          console.log('>>>project searched', parsedResponse);
          if (parsedResponse) {
            if (
              parsedResponse.message == 'Searched Issue fetched successfully!'
            ) {
              console.log('searched issue', parsedResponse);
              setIssueList(parsedResponse.issues);
              return;
            } else {
              console.log('seach issue msg', parsedResponse.message);
              setIssueList(parsedResponse.issues);
              return;
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const clearIssueInputState = () => {
    setIssueTitle('');
    setIssueDescription('');
    setIssueLabel(labeloptions[0]);
    setIssueAuthor('');
  };
  useEffect(() => {
    fetchAllIssues();
  }, []);

  const fetchAllIssues = async () => {
    try {
      setIsLoading(true);
      let response = await fetch(`${API_URL}/issue/all/${currentProject}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });

      let parsedResponse = await response.json();
      console.log('>>>Issue list', parsedResponse);
      setIssueList(parsedResponse.issues);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleSearchIssueLabel = (event) => {
    if (event.target.value == 'Select') {
      setsearchIssueLabel('');
    } else {
      setsearchIssueLabel(event.target.value);
    }
  };

  const clearSearchfilter = () => {
    hidetoast();
    hideSuccesstoast();
    setsearchIssueTitle('');
    setsearchIssueDesc('');
    setsearchIssueAuthor('');
    setsearchIssueLabel('');
    let select = document.getElementById('Searchlabel');
    select.value = 'Select';
    console.log(select);
    fetchAllIssues();
  };

  const handleback = () => {
    this.props.history.push('/projects', {
      currentUser: currentUser,
    });
  };

  let renderTodo = <div></div>;
  if (IssueList) {
    renderTodo = IssueList?.map((todo, index) => {
      return (
        <tr>
          <td>{index + 1}</td>
          <td>{todo.title}</td>
          <td>{todo.description}</td>
          <td>{todo.label}</td>
          <td>{todo?.author}</td>
        </tr>
      );
    });
  }

  return (
    <div>
      <nav class='navbar navbar-dark bg-primary'>
        <div class='container-fluid'>
          <Link
            className='back-btn'
            to={{
              pathname: '/projects',
              state: {
                currentUser: currentUser,
              },
            }}
          >
            back
          </Link>
        </div>
      </nav>
      {IsLoading ? (
        <div className='loader'>
          <img src={dotLoader} alt='loader' />
        </div>
      ) : (
        <>
          <div className='createform'>
            <h2> Create Issue </h2>
            <form onSubmit={issueCreationHandler}>
              <div class='row mb-3'>
                <label for='issueTitle' class='col-sm-2 col-form-label'>
                  Title
                </label>
                <div class='col-sm-10'>
                  <input
                    type='text'
                    class='form-control'
                    id='issueTitle'
                    placeholder='Title'
                    name='issueTitle'
                    value={IssueTitle}
                    onChange={(event) => setIssueTitle(event.target.value)}
                  />
                </div>
              </div>
              <div class='row mb-3'>
                <label for='issueDesc' class='col-sm-2 col-form-label'>
                  Description
                </label>
                <div class='col-sm-10'>
                  <input
                    type='text'
                    class='form-control'
                    id='issueDesc'
                    placeholder='Description'
                    name='issueDesc'
                    value={IssueDescription}
                    onChange={(event) =>
                      setIssueDescription(event.target.value)
                    }
                  />
                </div>
              </div>

              <div class='row mb-3'>
                <label for='issueLabel' class='col-sm-2 col-form-label'>
                  Label
                </label>
                <div class='col-sm-10'>
                  <select
                    className='dropdown'
                    name='issueLabel'
                    title='issueLabel'
                    onChange={(event) => setIssueLabel(event.target.value)}
                    value={IssueLabel}
                    id='issueLabel'
                  >
                    {labeloptions.map(function (label) {
                      return <option value={label}>{label}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div class='row'>
                <div class='col-sm-10 offset-sm-2'>
                  <button
                    type='submit'
                    class='btn btn-primary'
                    name='Create Issue'
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className='issuetable'>
            <h2>List of Issues</h2>
            <div>
              <input
                className='search-input'
                type='text'
                name='Searchtitle'
                placeholder='Title'
                value={searchIssueTitle}
                onChange={(event) => setsearchIssueTitle(event.target.value)}
              />
              <input
                className='search-input'
                type='text'
                name='Searchdescription'
                placeholder='Description'
                value={searchIssueDesc}
                onChange={(event) => setsearchIssueDesc(event.target.value)}
              />
              <input
                className='search-input'
                type='text'
                name='Searchauthor'
                placeholder='Author'
                value={searchIssueAuthor}
                onChange={(event) => setsearchIssueAuthor(event.target.value)}
              />
              <select
                className='search-input-dropdown'
                name='Searchlabel'
                title='Searchlabel'
                onChange={handleSearchIssueLabel}
                id='Searchlabel'
              >
                {labeloptions.map(function (label) {
                  return <option value={label}>{label}</option>;
                })}
                <option selected value='Select'>
                  Select
                </option>
              </select>
              <div className='btn-grp'>
                <button
                  class='btn btn-primary search-btn'
                  type='button'
                  label='search Issue'
                  value='search Issue'
                  onClick={issueSearchHandler}
                >
                  search Issue
                </button>
                <button
                  className='btn btn-primary search-btn'
                  type='button'
                  label='Clear Search'
                  value='Clear Search'
                  onClick={clearSearchfilter}
                >
                  Clear Search
                </button>
              </div>
            </div>
            <table class='table table-bordered'>
              <thead>
                <tr>
                  <th scope='col'>S.No</th>
                  <th scope='col'>Title</th>
                  <th scope='col'>Description</th>
                  <th scope='col'>Label</th>
                  <th scope='col'>Author</th>
                </tr>
              </thead>
              <tbody>{renderTodo}</tbody>
            </table>
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
                  onClick={hidetoast}
                ></button>
              </div>
              <div class='toast-body'>{errorMsg}</div>
            </div>
          </div>
          <div
            class='position-fixed bottom-0 end-0 p-3'
            style={{ zIndex: '11' }}
          >
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
        </>
      )}
    </div>
  );
};

export default Issues;
