import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Folder from './folder';
import { listFolders, selectFolder, addFolder } from '../actions';

class Folders extends Component {
  constructor(props) {
    super(props);

    this.props.listFolders();
    console.log('Folders props:', props);

    this.state = {
      showNewFolder: false,
      newFolder: ''
    }
  }

  submitNewFolder(e) {
    e.preventDefault();
    this.props.addFolder(this.state.newFolder);
    this.setState({newFolder: '', showNewFolder: false});
  }

  render() {
    if (!this.props.folders) {
      return <p>No folders in the database...</p>;
    }

    let newFolder = (
      <form onSubmit={this.submitNewFolder.bind(this)} className="new-folder">
        <input type="text"
               name="folder_name"
               placeholder="Folder Name"
               onChange={(e) => {this.setState({newFolder: e.target.value})} }
               value={this.state.newFolder} />
      </form>);

    return (
      <div>
        <h2>Folders</h2>

        <div>
          <span onClick={ () => {this.setState({showNewFolder: !this.state.showNewFolder})} }>Add Folder</span>
          {this.state.showNewFolder ? newFolder : ''}
        </div>

        <Folder />

        <ul className="folders">
          {
            this.props.folders.map((folder, idx) => {
              return (
                <li key={folder.doc._id} onClick={() => this.props.selectFolder(folder)}>
                  <div>
                    {folder.doc.name}
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { folders: state.folders };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    listFolders: listFolders,
    selectFolder: selectFolder,
    addFolder: addFolder
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Folders);
