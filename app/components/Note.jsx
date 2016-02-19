import React from 'react';

export default class Note extends React.Component {
	constructor(props) {
		super(props);

		// track `editing` state
		this.state = {
			editing: false
		};
	}

	render() {
		// render the component differently based on state
		if (this.state.editing) {
			return this.renderEdit();
		} else {
			return this.renderNote();
		}
	}

	renderNote = () => {
		// if the user clicks a normal note, trigger editing logic.
		const onDelete = this.props.onDelete;
		return (
			<div onClick={this.edit}>
				<span className="task">{this.props.task}</span>
				{onDelete ? this.renderDelete() : null }
			</div>
		);
	};

	renderDelete = () => {
		return <button 
			className="delete-note" 
			onClick={this.props.onDelete}>x</button>;
	};

	edit = () => {
    	// Enter edit mode.
    	this.setState({
			editing: true
		});
 	};
 	checkEnter = (e) => {
 		// if the user hit enter, let's finish up
 		if (e.key == 'Enter') {
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

 	renderEdit = () => {
		// we deal with blur and input handlers here. these map to dom events
		// we also set selection to input end to using a callback at a ref
		// it gets triggered after the component is mounted.
		//
		// we could also use a string ref (ie ref="input") and then refer to
		// the element in question later in the code.
		// This would allow us to use the underlying DOM API through this.refs.input
		// This can be useful when combined with React lifecycle hooks.
		return <input type="text"
			ref={
				(e) => e ? e.selectionStart = this.props.task.length : null
			}
			autoFocus={true}
			defaultValue={this.props.task}
			onBlur={this.finishEdit}
			onKeyPress={this.checkEnter} />;
	};

}
