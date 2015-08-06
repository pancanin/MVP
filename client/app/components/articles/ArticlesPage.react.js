var React = require('react');
var WebAPIUtils = require('../../utils/WebAPIUtils.js');
var ArticleStore = require('../../stores/ArticleStore.react.js');
var ErrorNotice = require('../../components/common/ErrorNotice.react.js');
var Article = require('../../components/articles/Article.react.js');
var ArticleActionCreators = require('../../actions/ArticleActionCreators.react.js');
var Router = require('react-router');
var Link = Router.Link;

var Pager = require( 'react-pager' );
var mui = require('material-ui'),
    ThemeManager = new mui.Styles.ThemeManager(),
    DropDownMenu = mui.DropDownMenu,
    RadioButtonGroup = mui.RadioButtonGroup,
    RadioButton = mui.RadioButton,
    DatePicker = mui.DatePicker;

var ArticlesPage = React.createClass({

    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    handlePageChanged: function ( newPage ) {
        this.setState({ current : newPage });
    },

    getInitialState: function () {
        return {
            articles: [],
            errors: [],
            sortingMenuItems: [
                { payload: '', text: 'None' },
                { payload: 'title', text: 'Title' },
                { payload: 'content', text: 'Content' },
                { payload: 'createdOn', text: 'Date Created' },
                { payload: 'votes', text: 'Votes' }
            ],
            total:        11,
            current:      7,
            visiblePages: 6

        };
    },

    componentDidMount: function () {
        ArticleStore.addChangeListener(this._onChange);
        ArticleActionCreators.loadArticles();
    },

    componentWillUnmount: function () {
        ArticleStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState({
            articles: ArticleStore.getAllArticles(),
            errors: ArticleStore.getErrors()
        });
    },

    sortArticles: function () {
        this.state.articles = this.state.articles.sort(function (a1, a2) {
            return a1.title.localeCompare(a2.title);
        });
    },
    render: function () {
        var articles = this.state.articles.map(function (article, idx) {
            return <Article title={article.title} content={article.content}/>
        });
        var errors = (this.state.errors.length > 0) ? <ErrorNotice errors={this.state.errors}/> : <div></div>;
        return (
            <div>
                <div className="row">
                    <div className="col-md-3">
                        <DropDownMenu ref="sortBy" menuItems={this.state.sortingMenuItems} />
                    </div>
                    <div className="col-md-2">
                        <RadioButtonGroup name="articleOrder" defaultSelected="1" ref="articleOrder">
                            <RadioButton
                                value="1"
                                label="Ascending"
                                style={{marginBottom:16}} />
                            <RadioButton
                                value="-1"
                                label="Descending" />
                        </RadioButtonGroup>
                    </div>
                    <div className="col-md-3 col-md-offset-1">
                        <DatePicker
                            ref="createdOn"
                            hintText="Created On"
                            mode="landscape" />
                    </div>
                </div>
                <div className="clearfix mb15"></div>
                {articles.length ? articles : "No articles match your criteria."}
                <Pager total={this.state.total}
                       current={this.state.current}

                       visiblePages={this.state.visiblePages}
                       onPageChanged={this.handlePageChanged}/>
            </div>

        );
    }
});

module.exports = ArticlesPage;
