/*
 * Copyright (C) 2020 Nicolas Pelletier
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import {Col, Row} from 'react-bootstrap';
import {convertMapToObject, formatDate} from '../../helpers/utils';

import CustomInput from '../../input';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {debounceUpdateAnnotation} from './actions';

/**
 * Container component. The AnnotationSection component contains a
 * field for entering or modifying annotations for this entity.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.annotation - The annotation object containing
 *        its content and lastRevision info
 * @param {Function} props.onAnnotationChange - A function to be called when the
 *        annotation is changed.
 * @returns {ReactElement} React element containing the rendered
 *          AnnotationSection.
 */
function AnnotationSection({
	annotation,
	onAnnotationChange
}) {
	const annotationLabel = (
		<span>
			Note
			<span className="text-muted"> (optional)</span>
		</span>
	);

	return (
		<div>
			<h2>
				Note
			</h2>
			<Row>
				<Col md={6} mdOffset={3}>
					<CustomInput
						defaultValue={annotation.content}
						label={annotationLabel}
						rows="4"
						tooltipText="Additional freeform data that does not fit in the above form"
						type="textarea"
						onChange={onAnnotationChange}
					/>
					{
						annotation && annotation.lastRevision &&
						<p className="small text-muted">Last modified: {formatDate(new Date(annotation.lastRevision.createdAt))}</p>
					}
					<p className="help-block">
						Notes allow you to enter freeform data that does not otherwise fit in the above form.
						<b> Do not submit any copyrighted text here.</b> The contents will be made available to the public under <a href="https://musicbrainz.org/doc/About/Data_License">open licenses</a>.
					</p>
				</Col>
			</Row>
		</div>
	);
}
AnnotationSection.displayName = 'AnnotationSection';
AnnotationSection.propTypes = {
	annotation: PropTypes.object.isRequired,
	onAnnotationChange: PropTypes.func.isRequired
};

function mapStateToProps(rootState) {
	return {
		annotation: convertMapToObject(rootState.get('annotationSection'))
	};
}


function mapDispatchToProps(dispatch) {
	return {
		onAnnotationChange: (event) =>
			dispatch(debounceUpdateAnnotation(event.target.value))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationSection);
