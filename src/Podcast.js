import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Button, Grid, Header, Icon, Item, Segment } from "semantic-ui-react";

class Podcast extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { data, match } = this.props;
		const podcast = data.find((item) => item.id == match.params.topicId);

		return podcast ? (
			<Grid.Row>
				<Grid.Column>
					<Item.Group>
						<Item>
							<Item.Image size='small' verticalAlign='middle' src={podcast.thumbnail} />
							<Item.Content>
								<Item.Header as={Header}>
									{podcast.title}
									<Header.Subheader>{podcast.url}</Header.Subheader>
								</Item.Header>
								<Item.Description>
									<Header>Episodes</Header>
									<Segment padded={podcast.episodes ? null : "very"} style={{ textAlign: "center", marginBottom: "1rem" }}>
										{podcast.episodes ? (
											podcast.episodes.map((item, index) => (
												<audio controls key={index}>
													<source src={item.audio} />
													Your browser does not support the audio element.
												</audio>
											))
										) : (
											<Header style={{ textAlign: "center" }}>Tidak Ada Episode</Header>
										)}
									</Segment>
								</Item.Description>
								<Item.Extra>
									<Button primary size='small' as={Link} to={`/`}>
										<Icon name='left chevron' />
										Kembali
									</Button>
								</Item.Extra>
							</Item.Content>
						</Item>
					</Item.Group>
				</Grid.Column>
			</Grid.Row>
		) : null;
	}
}

export default withRouter(Podcast);
