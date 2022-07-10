import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './assets/Projects.css';
import $ from 'jquery';

const API_URL = process.env.REACT_APP_API_URL;

const Projects = (props) => {
  const [currentUser, setCurrentUser] = useState(
    props.location.state?.currentUser
  );
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectList, setProjectList] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setsuccessMsg] = useState('');

  console.log(props);
  const user = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
  )?.userID;
  if (!user) {
    localStorage.clear();
    props.history.push('/');
    return;
  }
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
  const projectCreationHandler = async (e) => {
    e.preventDefault();
    hidetoast();
    hideSuccesstoast();
    let projectObj = {
      title: projectTitle,
      description: projectDescription,
      user: currentUser?.userID,
    };

    if (projectObj.title && projectObj.user && projectObj.description) {
      try {
        let response = await fetch(`${API_URL}/project/create`, {
          method: 'POST',
          body: JSON.stringify(projectObj),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}`,
          },
        });

        let parsedResponse = await response.json();

        console.log('>>>project created', parsedResponse);
        if (parsedResponse.message == 'Project already exists') {
          setErrorMsg('Project already exists');
          showtoast();
          return;
        }
        if (parsedResponse.message == 'Project Created') {
          setsuccessMsg('Project created Successfully');
          clearProjectInputState();
          fetchAllProject();
          setTimeout(() => {
            showSuccesstoast();
          }, 2000);
        } else {
          setErrorMsg('Project Not created.Please try again after sometime');
          showtoast();
          return;
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setErrorMsg('Please fill all the details to create project');
      showtoast();
      return;
    }
  };

  const clearProjectInputState = () => {
    setProjectTitle('');
    setProjectDescription('');
  };

  useEffect(() => {
    fetchAllProject();
  }, []);

  const fetchAllProject = async () => {
    try {
      let response = await fetch(`${API_URL}/project/all`, {
        method: 'GET',
        //   body: JSON.stringify(projectObj),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });

      let parsedResponse = await response.json();

      console.log('>>>project created', parsedResponse);
      setProjectList(parsedResponse.project);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignout = () => {
    localStorage.clear();
    props.history.push('/');
  };

  console.log(user);

  //   return (
  //     <div>
  //       <input type='button' value='Sign out' onClick={handleSignout}></input>
  //       <h1> Create a project </h1>

  //       <form onSubmit={projectCreationHandler}>
  //         <input
  //           type='text'
  //           name='title'
  //           value={projectTitle}
  //           onChange={(event) => setProjectTitle(event.target.value)}
  //         />

  //         <input
  //           type='text'
  //           name='title'
  //           value={projectDescription}
  //           onChange={(event) => setProjectDescription(event.target.value)}
  //         />

  //         <input type='submit' name='Create Project' />
  //       </form>

  //       <h1>List Of available Project</h1>
  //       <ul>
  //         {projectList &&
  //           projectList?.map((todo, index) => {
  //             return (
  //               <>
  //                 <li>
  //                   <Link
  //                     to={{
  //                       pathname: '/issues',
  //                       state: {
  //                         currentUser: currentUser,
  //                         currentProject: todo._id,
  //                       },
  //                     }}
  //                   >
  //                     {todo.title}
  //                   </Link>
  //                 </li>
  //                 <li>{todo.description}</li>
  //               </>
  //             );
  //           })}
  //       </ul>
  //     </div>
  //   );

  let renderTodos =
    projectList &&
    projectList?.map((todo, index) => {
      return (
        <tr>
          <th scope='row'>{index + 1}</th>
          <td>
            {' '}
            <Link
              to={{
                pathname: '/issues',
                state: {
                  currentUser: currentUser,
                  currentProject: todo._id,
                },
              }}
            >
              {todo.title}
            </Link>
          </td>
          <td>{todo.description}</td>
        </tr>
      );
    });

  return (
    <div>
      <nav class='navbar navbar-dark bg-primary'>
        <div class='container-fluid'>
          <a class='navbar-brand'>Hi , {currentUser?.username} !</a>
          <form class='d-flex'>
            <button
              class='btn btn-danger'
              value='Sign out'
              onClick={handleSignout}
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>
      <div className='createform'>
        <h2> Create a project </h2>
        <form onSubmit={projectCreationHandler}>
          <div class='row mb-3'>
            <label for='inputEmail' class='col-sm-2 col-form-label'>
              Title
            </label>
            <div class='col-sm-10'>
              <input
                type='text'
                class='form-control'
                id='inputTitle'
                placeholder='Title'
                name='title'
                value={projectTitle}
                onChange={(event) => setProjectTitle(event.target.value)}
              />
            </div>
          </div>
          <div class='row mb-3'>
            <label for='inputPassword' class='col-sm-2 col-form-label'>
              Description
            </label>
            <div class='col-sm-10'>
              <input
                type='text'
                class='form-control'
                id='inputDescription'
                placeholder='Description'
                name='Description'
                value={projectDescription}
                onChange={(event) => setProjectDescription(event.target.value)}
              />
            </div>
          </div>

          <div class='row'>
            <div class='col-sm-10 offset-sm-2'>
              <button type='submit' class='btn btn-primary'>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className='projecttable'>
        <h2>List of Projects</h2>
        <table class='table table-bordered'>
          <thead>
            <tr>
              <th scope='col'>S.No</th>
              <th scope='col'>Title</th>
              <th scope='col'>Description</th>
            </tr>
          </thead>
          <tbody>{renderTodos}</tbody>
        </table>
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
            {/* <img src="..." class="rounded me-2" alt="..."> */}
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
    </div>
  );
};

export default Projects;
