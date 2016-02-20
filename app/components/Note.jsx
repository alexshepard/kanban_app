import React from 'react';

import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const noteSource = {
	beginDrag(props) {
		return {
			id: props.id
		};
	},
	isDragging(props, monitor) {
		return props.id === monitor.getItem().id;
	}
};

const noteTarget = {
	hover(targetProps, monitor) {
		const targetId = targetProps.id;
		const sourceProps = monitor.getItem();
		const sourceId = sourceProps.id;

		if (sourceId !== targetId) {
			targetProps.onMove({ sourceId, targetId });
		}
	}
};

@DragSource(ItemTypes.TYPE, noteSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging()	// map isDragging() state to isDragging prop
}))
@DropTarget(ItemTypes.TYPE, noteTarget, (connect) => ({
	connectDropTarget: connect.dropTarget()
}))
class Note extends React.Component {
	render() {
		const {connectDragSource, connectDropTarget, isDragging, onMove, id, editing, ...props} = this.props;
		const dragSource = editing ? a => a : connectDragSource;
		
		return dragSource(connectDropTarget(
			<li style={{
				opacity: isDragging ? 0 : 1
			}} {...props}>{props.children}</li>
		));
	}
}

export default Note;
