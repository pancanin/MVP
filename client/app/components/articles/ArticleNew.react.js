var React = require('react');
var AppDispatcher = require('../../dispatcher/AppDispatcher.js');
var AppConstants = require('../../constants/AppConstants.js');
var WebAPIUtils = require('../../utils/WebAPIUtils.js');
var SessionStore = require('../../stores/SessionStore.react.js');
var ArticleActionCreators = require('../../actions/ArticleActionCreators.react.js');
var RouteActionCreators = require('../../actions/RouteActionCreators.react.js');
var MenuList = require('../common/MenuList.react.js');
var TagsInput = require('react-tagsinput');
var TaggedInput = require('react-tagged-input');

//Theme dependencies:
var mui = require('material-ui'),
    ThemeManager = new mui.Styles.ThemeManager(),
    RaisedButton = mui.RaisedButton,
    TextField = mui.TextField,
    Tab = mui.Tab,
    Tabs = mui.Tabs;

/*
 Styles
 */
var articleBox = {
    maxWidth: '1140px !important',
    border: '1px solid black',
    padding: '15px',
    margin: '0 auto'
};

var ArticleNew = React.createClass({

    getInitialState: function () {
        return {
            tags: "",
            categories: ""
        }
    },

    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    _onChange: function () {
        this.setState({errors: SessionStore.getErrors()});
    },

    componentDidMount: function () {
        if (!SessionStore.isLoggedIn()) {
            //RouteActionCreators.redirect('main');
        }
    },

    _onSubmit: function (e) {
        e.preventDefault();
        this.setState({errors: []});
        var title = this.refs.title.getValue();
        var content = this.refs.content.getValue();
        var tags = this.refs.tags.getTags();
        var categories = this.refs.categories.getTags();
        ArticleActionCreators.createArticle(title, content, tags, categories);
        RouteActionCreators.redirect('main');
    },

    render: function () {
        return (
            <Tabs>
                <Tab label="Title & Content" >
                    <TextField
                        ref="title"
                        hintText="Enter article title..."
                        floatingLabelText="Title"
                        fullWidth={true}/>
                    <TextField
                        ref="content"
                        hintText="Say what`s on your mind :)"
                        floatingLabelText="Content"
                        multiLine={true}
                        rows={12}
                        fullWidth={true}/>
                </Tab>
                <Tab label="Tags & Categories" >
                    <div>
                        <h2>Tags</h2>
                        <p>
                            <TagsInput ref="tags" />
                        </p>
                        <h2>Categories</h2>
                        <p>
                            <TagsInput ref="categories" />
                        </p>
                    </div>
                </Tab>
                <Tab label="Cover Photo" >
                    <div>
                        <h2>Upload Photo</h2>
                        <p>
                            Place image upload here
                        </p>
                    </div>
                    <RaisedButton type="submit" className="pull-right" label="Publish" secondary={true}/>
                </Tab>
            </Tabs>
        );
    }
});

module.exports = ArticleNew;
