var React 		= require('react');
var ReactDOM 	= require('react-dom');


var SearchHints = React.createClass({
	handleClick: function(e) {
		// console.log('call di ma di' + e.target.innerHTML);
		this.props.termSelected(e.target.innerHTML);
	},
	render: function() {
		var hints 		= this.props.hints || [];
		var hintMarkup 	= [];
		var self 		= this;

		hints.forEach(function(h) {
			hintMarkup.push(
				<li>
					<a href="#" 
						onClick={self.handleClick}>
						{h.word}
					</a>
				</li>
			);
		});

		return (
			<ul className="nav nav-pills nav-stacked">
				{hintMarkup}
			</ul>
		);
	}
});


var AutoCompleteSearchBar = React.createClass({
	getInitialState: function() {
	    return {
	    	queryValue: '',
	    	lastQuery: ''
	    };
	},
	isQueryble: function(last, cur) {
		return cur.length > 0 && 
			Math.abs(last.length-cur.length) >= (this.props.queryThreshold || 3);
	},
	handleTextChange: function(e) {
		this.setState({
			queryValue: e.target.value
		});
		if(this.isQueryble(this.state.lastQuery, e.target.value)) {
			this.setState({
				lastQuery: e.target.value
			});
			console.log('Quering the server');

			// async query
			this.props.query(e.target.value);
		}
	},
	handleTermSelected: function(term) {
		this.setState({
			queryValue: term
		});
		this.props.termSelected(term);
	},
	render: function() {
		return (
			<div>
				<input 
					type="text" 
					placeholder="Search Vocabulary" 
					className="search-input" 
					onChange={this.handleTextChange}
					value={this.state.queryValue}
					onFocus={this.props.onFocus}
					onBlur={this.props.onBlur}
					/>
				<SearchHints 
					hints={this.props.hints} 
					termSelected={this.handleTermSelected}/>
			</div>
		);
	}
});


var ActionBar = React.createClass({
	getInitialState: function() {
	    return {
	      	stateBtnClassName: 'ion-ios-search',
	      	hints: []    
	    };
	},
	handleBack: function() {
		document.location.href = this.props.exitUrl;
	},
	handleFocus: function() {
		this.setState({
			stateBtnClassName: 'ion-ios-close-empty',
		});
		this.props.onFocusAutoCompleteBar();
	},
	handleBlur: function() {
		this.setState({
			// hints: [],
			// stateBtnClassName: 'ion-ios-search',
		});
	},
	handleQuery: function(q) {
		console.error('Will Query server for: ' + q);
		var self = this;
		$.get('/ex/search?q='+q, function(res) {
			if(res.code === 0) {
				self.setState({hints: res.msg});
			}
		});
	},
	handleStateBtnClicked: function() {
		console.log('Click called!' + this.state.stateBtnClassName);
		if(this.state.stateBtnClassName ==='ion-ios-close-empty') {
			this.setState({
				stateBtnClassName: 'ion-ios-search',
				hints: []
			});
		}
	},
	handleTermSelected: function(term) {
		this.setState({
			stateBtnClassName: 'ion-ios-search',
			hints: []
		});

		this.props.termSelected(term);
	},
	render: function() {
		return (
			<nav className="navbar navbar-default navbar-fixed-top white-bkgrnd shadow">
			  	<div className="container-fluid">
			  	 	<div className="row">
			  	 		<div className="col-xs-1 text-right nospace">
			  	 			<a href="#" 
			  	 				className="action-btn" 
			  	 				onClick={this.handleBack}>
			  	 				<i className='ion-ios-arrow-thin-left' aria-hidden="true" />
			  	 			</a>
			  	 		</div>
			  	 		<div className="col-xs-10 nospace">
			  	 			<AutoCompleteSearchBar 
			  	 				onFocus={this.handleFocus}
			  	 				onBlur={this.handleBlur}
			  	 				hints={this.state.hints}
			  	 				query={this.handleQuery}
			  	 				termSelected={this.handleTermSelected}
			  	 			/>
			  	 		</div>

			  	 		<div className="col-xs-1 nospace">
			  	 			<a href="#" className="action-btn" onClick={this.handleStateBtnClicked}>
			  	 				<i className={this.state.stateBtnClassName} />
			  	 			</a>
			  	 		</div>
			  	 	</div>
			  	</div>
			</nav>
		);
	}
});


var Visualizer = React.createClass({
	getInitialState: function() {
	    return {
	    	tree: Object()
	    };
	},
	getData: function(cb) {
		$.get('/ex/vocab.json', function(res) {
			if(res.code === 0) {
				cb(res.msg);
			} else {
				cb(null);
			}
		});
	},
	componentDidMount: function() {
		var self = this;

		self.getData(function(data) {
			if(data) {
				var tree = $('#tree').treeview({
					data: [data]
 				});

 				self.setState({
 					tree: tree
 				});
			}
		});
	},
	handleTermSelect: function(term) {
		console.log("Term selected: " + term);

		var array = this.state.tree.treeview('search', [
			term.toString().trim(), {
				ignoreCase: false,     // case insensitive
  				exactMatch: true,    // like or equals
  				// revealResults: true,   // reveal matching nodes
			}
		]);

		if(array.length > 0) {
			this.state.tree.treeview(
				'revealNode', 
				[ array[0], { silent: true } ]
			);
		}
	},
	handleFocus: function() {
		this.state.tree.treeview('clearSearch');
		this.state.tree.treeview('collapseAll', { levels: 1, silent: true });
		this.state.tree.treeview('expandAll', { levels: 1, silent: true });
	},
	render: function() {
		return (
			<div>
				<ActionBar 
					exitUrl="http://192.168.1.3:3000/ex/exit"
					termSelected={this.handleTermSelect} 
					onFocusAutoCompleteBar={this.handleFocus}/>
				<div>
					<div className="container-fluid">
						<div className="row">
							<div className="col-md-12 dark-bkgrnd">
								<div id="tree"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
		);
	}
});


ReactDOM.render(
	<Visualizer />, 
	document.getElementById('content')
);