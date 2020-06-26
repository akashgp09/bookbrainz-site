/*
 * Copyright (C) 2017  Ben Ockmore
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

import * as bootstrap from 'react-bootstrap';
import * as entityHelper from '../../../helpers/entity';

import AddToCollectionModal from '../parts/add-to-collection-modal';
import EntityFooter from './footer';
import EntityImage from './image';
import EntityLinks from './links';
import EntityTitle from './title';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import WorksTable from './work-table';


const {
	deletedEntityMessage, extractAttribute, getEditionPublishers, getEditionReleaseDate, getEntityUrl,
	getLanguageAttribute, getRelationshipTargetByTypeId, ENTITY_TYPE_ICONS, getSortNameOfDefaultAlias
} = entityHelper;
const {Col, Row} = bootstrap;

function EditionAttributes({edition}) {
	if (edition.deleted) {
		return deletedEntityMessage;
	}
	const status = extractAttribute(edition.editionStatus, 'label');
	const format = extractAttribute(edition.editionFormat, 'label');
	const pageCount = extractAttribute(edition.pages);
	const weight = extractAttribute(edition.weight);
	const width = extractAttribute(edition.width);
	const height = extractAttribute(edition.height);
	const depth = extractAttribute(edition.depth);

	const sortNameOfDefaultAlias = getSortNameOfDefaultAlias(edition);
	const releaseDate = getEditionReleaseDate(edition);
	const publishers = getEditionPublishers(edition);
	const languages = getLanguageAttribute(edition).data;

	return (
		<div>

			<Row>
				<Col md={3}>
					<dl>
						<dt>Sort Name</dt>
						<dd>{sortNameOfDefaultAlias}</dd>
						<dt>Release Date</dt>
						<dd>{releaseDate}</dd>
						<dt>Format</dt>
						<dd>{format}</dd>
					</dl>
				</Col>
				<Col md={3}>
					<dl>
						<dt>Status</dt>
						<dd>{status}</dd>
						<dt>Languages</dt>
						<dd>{languages}</dd>
					</dl>
				</Col>
				<Col md={3}>
					<dl>
						<dt>Dimensions (WxHxD)</dt>
						<dd>{width}&times;{height}&times;{depth} mm</dd>
						<dt>Weight</dt>
						<dd>{weight} g</dd>
						<dt>Page Count</dt>
						<dd>{pageCount}</dd>
					</dl>
				</Col>
				<Col md={3}>
					<dl>
						<dt>Publishers</dt>
						<dd>{publishers}</dd>
					</dl>
				</Col>
			</Row>
		</div>
	);
}
EditionAttributes.displayName = 'EditionAttributes';
EditionAttributes.propTypes = {
	edition: PropTypes.object.isRequired
};

// eslint-disable-next-line react/prefer-stateless-function
class EditionDisplayPage extends React.Component {
	// eslint-disable-next-line no-useless-constructor
	constructor(props) {
		super(props);
		this.state = {
			showModal: false
		};

		this.onCloseModal = this.onCloseModal.bind(this);
		this.onShowModal = this.onShowModal.bind(this);
	}

	onCloseModal() {
		this.setState({showModal: false});
	}

	onShowModal() {
		this.setState({showModal: true});
	}

	render() {
		// relationshipTypeId = 10 refers the relation (<Work> is contained by <Edition>)
		const relationshipTypeId = 10;
		const worksContainedByEdition = getRelationshipTargetByTypeId(this.props.entity, relationshipTypeId);
		const urlPrefix = getEntityUrl(this.props.entity);
		let editionGroupSection;
		if (this.props.entity.editionGroup) {
			editionGroupSection = (
				<div className="margin-bottom-d15">
					<a href={`/edition-group/${this.props.entity.editionGroup.bbid}`}>
						<FontAwesomeIcon icon="external-link-alt"/>
						<span>&nbsp;See all similar editions</span>
					</a>
				</div>
			);
		}
		else if (!this.props.entity.deleted) {
			editionGroupSection = (
				<span className="bg-danger">
					Edition Group unset - please edit this Edition and add one if you see this!
				</span>
			);
		}
		return (
			<div>
				<div>
					<AddToCollectionModal
						closeCallback={this.onCloseModal}
						entities={[this.props.entity]}
						entityType="Edition"
						show={this.state.showModal}
					/>
				</div>
				<Row className="entity-display-background">
					<Col className="entity-display-image-box text-center" md={2}>
						<EntityImage
							backupIcon={ENTITY_TYPE_ICONS.Edition}
							deleted={this.props.entity.deleted}
							imageUrl={this.props.entity.imageUrl}
						/>
					</Col>
					<Col md={10}>
						<EntityTitle entity={this.props.entity}/>
						<EditionAttributes edition={this.props.entity}/>
						{editionGroupSection}
					</Col>
				</Row>
				{!this.props.entity.deleted &&
				<React.Fragment>
					<WorksTable
						entity={this.props.entity}
						works={worksContainedByEdition}
					/>
					<EntityLinks
						entity={this.props.entity}
						identifierTypes={this.props.identifierTypes}
						urlPrefix={urlPrefix}
					/>
				</React.Fragment>}
				<hr className="margin-top-d40"/>
				<EntityFooter
					bbid={this.props.entity.bbid}
					deleted={this.props.entity.deleted}
					entityUrl={urlPrefix}
					handleAddToCollection={this.onShowModal}
					lastModified={this.props.entity.revision.revision.createdAt}
				/>
			</div>
		);
	}
}
EditionDisplayPage.displayName = 'EditionDisplayPage';
EditionDisplayPage.propTypes = {
	entity: PropTypes.object.isRequired,
	identifierTypes: PropTypes.array
};
EditionDisplayPage.defaultProps = {
	identifierTypes: []
};

export default EditionDisplayPage;
