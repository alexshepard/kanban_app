import React from 'react';

class Note extends React.Component {
	constructor(props) {
		super(props);

		// track `editing` state
		this.state = {
			editing: false
		};
	}
	render() {
    	if (this.state.editing) {
			return this.renderEdit();
		}

    	return this.renderNote();
	}
 	renderEdit = () => {
		return <input type="text"
			ref={
				(e) => e ? e.selectionStart = this.props.task.length : null
			}
			autoFocus={true}
			defaultValue={this.props.task}
			onBlur={this.finishEdit}
			onKeyPress={this.checkEnter} />;
	};

	renderDelete = () => {
		return <button 
      className="delete-note"
			onClick={this.props.onDelete}>x</button>;
	};
	renderNote = () => {
		const onDelete = this.props.onDelete;

		return (
			<div onClick={this.edit}>
				<span className="task">{this.props.task}</span>
				{onDelete ? this.renderDelete() : null }
			</div>
		);
	};
	edit = () => {
    	this.setState({
			editing: true
		});
 	};
 	checkEnter = (e) => {
 		if (e.key === 'Enter') {
 			this.finishEdit(e);
 		}
 	};

 	finishEdit = (e) => {
 		// `Note` will trigger an optional `onEdit` callback when it has a new value
 		// We will use this to communicate the change to `App`
 		// A smarter way to deal with the default value would be to set it thru
 		// `defaultProps`
 		// See the *Typing with React* chapter for more info
 		const value = e.target.value;
 		if (this.props.onEdit) {
 			this.props.onEdit(value);

			// exit edit mode
			this.setState({
				editing: false
			});
		}
	 		
 	};

}



export default Note;
