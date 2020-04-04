import _ from "lodash";
import React, { Component } from "react";
import { Link, Route, Switch, withRouter } from "react-router-dom";
import { Button, Container, Grid, Header, Icon, Item, Placeholder, Search, Segment, Image } from "semantic-ui-react";
import logo from "./logo.svg";
import Podcast from "./Podcast";

const url = "https://json-server-heroku-svoqwyfacm.now.sh/podcasts";
const initialState = { isLoading: false, results: [], value: "" };

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			podcast: [],
			results: [],
			isLoading: false,
		};
	}

	componentDidMount = async () => {
		let data = await fetch(url);
		data = await data.json();

		this.setState({
			podcast: data,
		});
	};

	handleResultSelect = (e, { result }) => this.setState({ value: result.title });

	handleSearchChange = (e, { value }) => {
		const source = this.state.podcast;

		this.setState({ isLoading: true, value });

		setTimeout(() => {
			if (this.state.value.length < 1) return this.setState(initialState);

			const re = new RegExp(_.escapeRegExp(this.state.value), "i");
			const isMatch = (result) => re.test(result.title);

			this.setState({
				isLoading: false,
				results: _.filter(source, isMatch),
			});
		}, 300);
	};

	renderPodcast = (data) => {
		return data.map((item) => {
			return (
				<Item key={item.id}>
					<Item.Image src={item.thumbnail} />
					<Item.Content verticalAlign='middle'>
						<Item.Header as={Header}>
							{item.title}
							<Header.Subheader>{item.url}</Header.Subheader>
						</Item.Header>
						<Item.Extra>
							<Button primary size='small' as={Link} to={`/podcast/${item.id}`}>
								Lihat
								<Icon name='right chevron' />
							</Button>
						</Item.Extra>
					</Item.Content>
				</Item>
			);
		});
	};

	render() {
		const { match } = this.props;
		const { isLoading, value, results, podcast } = this.state;
		const data = value ? results : podcast;

		return (
			<>
				<Container>
					<Grid centered columns={2}>
						<Grid.Row>
							<Grid.Column>
								<Image src={logo} centered size='small' className='App-logo' alt='logo' />
							</Grid.Column>
						</Grid.Row>
						<Switch>
							<Route path={`${match.path}podcast/:topicId`}>
								<Podcast data={this.state.podcast} />
							</Route>
							<Route path={match.path}>
								<Grid.Row>
									<Grid.Column>
										<Search
											fluid
											input={{ fluid: true }}
											showNoResults={false}
											loading={isLoading}
											onResultSelect={this.handleResultSelect}
											onSearchChange={_.debounce(this.handleSearchChange, 500, {
												leading: true,
											})}
											value={value}
										/>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>
										{value && results.length === 0 ? (
											<Segment placeholder>
												<Header icon>
													<Icon name='search' />
													We don't have any documents matching your query.
												</Header>
												<Segment.Inline>
													<Button primary onClick={() => this.setState({ value: "" })}>
														Clear Query
													</Button>
												</Segment.Inline>
											</Segment>
										) : (
											<Item.Group divided>
												{podcast.length
													? this.renderPodcast(data)
													: _.range(0, 2).map((item, index) => {
															return (
																<Item key={index}>
																	<Placeholder as={Item.Image} style={{ height: 150, width: 150 }}>
																		<Placeholder.Image />
																	</Placeholder>

																	<Item.Content verticalAlign='middle'>
																		<Item.Description>
																			<Placeholder>
																				<Placeholder.Header>
																					<Placeholder.Line />
																					<Placeholder.Line />
																				</Placeholder.Header>
																			</Placeholder>
																		</Item.Description>
																		<Item.Extra>
																			<Button primary size='small' disabled>
																				Lihat
																				<Icon name='right chevron' />
																			</Button>
																		</Item.Extra>
																	</Item.Content>
																</Item>
															);
													  })}
											</Item.Group>
										)}
									</Grid.Column>
								</Grid.Row>
							</Route>
						</Switch>
					</Grid>
				</Container>
			</>
		);
	}
}

export default withRouter(App);
