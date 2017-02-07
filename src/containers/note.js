import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { saveNote } from '../actions/note_actions';
import { selectFolder } from '../actions/folder_actions';

class Note extends Component {
  constructor(props) {
    super(props);

    this.state = {
      doc: {_id: null, title: '', body: ''},
      editNote: false,
      addNote: false
    }
  }

  saveNote(e) {
    e.preventDefault();
    const note = this.state.doc;
    if (!note.folder || !this.props.folder) {
      if (this.props.folder) {
        note.folder = this.props.folder._id;
      } else {
        note.folder = 'main';
      }
    }

    this.props.saveNote(note);
    this.setState({
      editNote: false,
      addNote: false,
      doc: {_id: null, title: '', body: ''}
    })
  }

  editNote() {
    this.setState({
      editNote: !this.state.editNote,
      doc: this.props.note.doc
    })
  }

  handleNoteChange(e) {
    e.preventDefault();
    const doc = this.state.doc;
    doc[e.target.name] = e.target.value;
    this.setState({doc: doc});
  }

  cancelAction(e) {
    e.preventDefault();

    if (this.state.editNote) {
      this.setState({editNote: false, doc: {_id: null, title: '', body: ''}});
    } else if (this.state.addNote) {
      this.setState({addNote: false});
    }
  }

  render() {
    let noteAction;
    if (this.props.note) {
      noteAction = (
        <div>
          <div onClick={() => this.setState({addNote: true})}>
            Add Note
          </div>
          <div onClick={this.editNote.bind(this)}>
            Edit Note
          </div>
        </div>
      );
    } else {
      noteAction = (
        <div onClick={() => this.setState({addNote: true})}>
          Add Note
        </div>
      );
    }

    const noteForm = (
      <div>
        <span onClick={this.cancelAction.bind(this)}>Cancel</span>
        <br/>
        <form>
          <input type="text" name="title" placeholder="Title" value={this.state.doc.title} onChange={this.handleNoteChange.bind(this)} />
          <br/><br/>
          <input type="text" name="body" placeholder="Write something..." value={this.state.doc.body} onChange={this.handleNoteChange.bind(this)} />
          <br/><br/>
          <button onClick={this.saveNote.bind(this)}>Save</button>
        </form>
      </div>
    );

    const showNote = (
      <div>
        {noteAction}
        <p>{this.props.note ? this.props.note.doc.title : ''}</p>
        <p>{this.props.note ? this.props.note.doc.body : ''}</p>
      </div>
    );

    return (
      <div>
        <h2>Note</h2>

          {this.state.addNote ? noteForm : ''}

          {this.state.editNote ? noteForm : showNote}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  // console.log('Note mapStateToProps state:', state);
  return { note: state.app.activeNote, folder: state.app.activeFolder };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    saveNote: saveNote,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Note);
