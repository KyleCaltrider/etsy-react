import React from 'react';
import Select from 'react-select';
import ReactMarkdown from 'react-markdown';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updates: [],
      pages: [],
      editPage: undefined,
      editElement: undefined,
      editorText: "",
      user: "",
      password: "",
      loginToggle: false,
      messageToAdmin: ""
    }

    // State Bindings
    this.updatePages = this.updatePages.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleElementChange = this.handleElementChange.bind(this);
    this.handleEditor = this.handleEditor.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.requestUpdate = this.requestUpdate.bind(this);
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.toggleLogin = this.toggleLogin.bind(this);
    this.clearAdminMessage = this.clearAdminMessage.bind(this);
  }
  
  componentDidMount() {
    this.updatePages();
  }

  updatePages() {
    const xhr = new XMLHttpRequest();
    xhr.onload = async() => {
      if (xhr.response) {
        try {
          let pages = await JSON.parse(xhr.response);
          console.log("CMS:", pages);
          this.setState({
            pages: pages
          });
        }
        catch(err) {
          console.error(err);
        }
      }
    }
    xhr.open("GET", "/api/update");
    xhr.send();
  }

  handlePageChange(e) {
    this.setState({editPage: e.value, editElement: undefined, editorText: ""});
  }

  handleElementChange(e) {
    const { editPage, pages, updates } = this.state;
    let updatedPageIdx = updates.findIndex(p => p.name === editPage);
    let nextElementText = false;
    if (updatedPageIdx !== -1) {
      if (updates[updatedPageIdx].hasOwnProperty(e.value)) {
        nextElementText = updates[updatedPageIdx][e.value];
      }
    }
    if (!nextElementText) {
      const pageIdx = pages.findIndex(p => p.name === editPage);
      nextElementText = pages[pageIdx].contents[e.value];
    }
    this.setState({editElement: e.value, editorText: nextElementText});
  }

  handleEditor(e) {
    this.setState({editorText: e.target.value});
  }

  handleUpdate(page, element, update) {
    const  { updates, pages } = this.state;
    if (!page || !element || !update || pages.length === 0) return;
    const pageIdx = pages.findIndex(p => p.name === page);
    if (pages[pageIdx].contents[element] !== update) {
      const updatedPageIdx = updates.findIndex(p => p.name === page);
      let updatedPage = {};
      if (updatedPageIdx === -1) {
        updatedPage = {name: page};
        updatedPage[element] = update;
        updates.push(updatedPage);
      }
      else {
        updatedPage = updates[updatedPageIdx];
        updatedPage[element] = update;
        updates[updatedPageIdx] = updatedPage;
      }
      this.setState({updates});
    }
  }

  handleLoginChange(e) {
    const name = e.target.name,
          value = e.target.value,
          state = {};
          state[name] = value;
    this.setState(state);
  }

  requestUpdate() {
    const { user, password, updates } = this.state;
    let submission = new FormData();
    submission.append("user", user);
    submission.append("password", password);
    submission.append("updates", JSON.stringify(updates));
    const xhr = new XMLHttpRequest();
    xhr.onload = async () => {
      if (xhr.response) {
        let response = await JSON.parse(xhr.response);
        this.setState({
          messageToAdmin: response,
          login: false
        });
        this.updatePages();
      };
    };
    xhr.open("POST", "/api/cms");
    xhr.send(submission);
  }

  toggleLogin() {
    this.setState({loginToggle: !this.state.loginToggle });
  }

  clearAdminMessage() {
    this.setState({messageToAdmin: ""});
  }

  render() {
    let view = [],
        elements = [],
        epSelect = "Select A Page...",
        eeSelect = "Select A Page Element...",
        { editPage, editElement } = this.state;
    if (!editPage) editPage = epSelect;
    if (!editElement) editElement = eeSelect
  
    if (editPage !== epSelect) {
      view = this.state.pages.find(page => page.name === editPage);
      if (view) {
        view = view.contents;
        elements = Object.keys(view);
      }
    }
    console.log("Admin Message:", this.state.messageToAdmin);

    const renderLogin = () => {
      const {loginToggle} = this.state;
      if (this.state.loginToggle) return(
        <div id="login">
          <input type="text" name="user"
                 value={this.state.user}
                 placeholder="Admin User"
                 onChange={this.handleLoginChange} />
          <input type="password"
                 name="password"
                 value={this.state.password}
                 placeholder="Admin Password"
                 onChange={this.handleLoginChange} />
          <button  onClick={() => {
            this.requestUpdate()
            this.toggleLogin()
          }}>Submit Updates</button>
        </div>
      )
    }

    const renderAdminMessage = () => {
      const { messageToAdmin } = this.state;
      if (typeof messageToAdmin === "object") {
        let cls = messageToAdmin.hasOwnProperty("success") ?
                        "success" : messageToAdmin.hasOwnProperty("fail") ?
                            "fail" : "";
        return(
          <div className="container">
            <div id="admin-message-container" className={cls}>
              <div className="close" onClick={this.clearAdminMessage} >
                <div className="barL" />
                <div className="barR" />
              </div>
              <h1 className={ "admin-message"}>{ messageToAdmin[cls] }</h1>
            </div>
          </div>
        )
      }
    }

    return(
      <div className="App">
        <header id="header">
          <h1>Welcome To The Admin Portal</h1>
        </header>
        {renderAdminMessage()}
        <div id="editor-options">
          <Select className="edit-select"
                  options={this.state.pages.map(p => ({label: p.name, value: p.name}))}
                  isSearchable={true}
                  value={{label: editPage, value: editPage}}
                  onChange={this.handlePageChange} />
          <Select className="edit-select"
                  options={elements.map(e => ({label: e, value: e}))}
                  isSearchable={true}
                  value={{label: editElement, value: editElement}}
                  onChange={this.handleElementChange} />
        </div>
        <div id="editor-container">
          <ReactMarkdown className="preview" source={this.state.editorText} />
          <textarea id="editor"
                    value={this.state.editorText}
                    onChange={this.handleEditor}
                    rows="10"
                    onBlur={() => {
                      const { editPage, editElement, editorText } = this.state;
                      this.handleUpdate(editPage, editElement, editorText);
                    }} />
          <button onClick={this.toggleLogin}>Update Website</button>
        </div>
        <div className="container">
          {renderLogin()}
        </div>
      </div>
    );
  };
}

export default App;
