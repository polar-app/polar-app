import React from "react";
import PropTypes from "prop-types";

interface IProps {

    /**
     * The current page number.
     */
    readonly page: number;

    /**
     * Total number of pages.
     */
    readonly pages: number;
    readonly onPageChange: (page: number) => void;
    readonly previousText: string;

    readonly nextText: string;
    readonly PageButtonComponent: React.ElementType;
}

interface IState {
    readonly visiblePages: ReadonlyArray<number>;
}

const defaultButton = (props: any) => <button {...props}>{props.children}</button>;

export default class Pagination extends React.Component<IProps, IState> {

    constructor(props: IProps) {

        super(props);

        this.changePage = this.changePage.bind(this);

        this.state = {
            visiblePages: this.getVisiblePages(0, props.pages)
        };
    }

    private static propTypes = {
        pages: PropTypes.number,
        page: PropTypes.number,
        PageButtonComponent: PropTypes.any,
        onPageChange: PropTypes.func,
        previousText: PropTypes.string,
        nextText: PropTypes.string
    };

    public componentWillReceiveProps(nextProps: any) {

        if (this.props.pages !== nextProps.pages) {
            this.setState({
                visiblePages: this.getVisiblePages(0, nextProps.pages)
            });
        }

        this.changePage(nextProps.page + 1);

    }

    private filterPages = (visiblePages: ReadonlyArray<number>, totalPages: number) => {
        return visiblePages.filter(page => page <= totalPages);
    }

    private getVisiblePages = (page: number, total: number): ReadonlyArray<number> => {
        if (total < 7) {
            return this.filterPages([1, 2, 3, 4, 5, 6], total);
        } else {
            if (page % 5 >= 0 && page > 4 && page + 2 < total) {
                return [1, page - 1, page, page + 1, total];
            } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
                return [1, total - 3, total - 2, total - 1, total];
            } else {
                return [1, 2, 3, 4, 5, total];
            }
        }
    }

    private changePage(page: number) {
        const activePage = this.props.page + 1;

        if (page === activePage) {
            return;
        }

        const visiblePages = this.getVisiblePages(page, this.props.pages);

        this.setState({
            visiblePages: this.filterPages(visiblePages, this.props.pages)
        });

        this.props.onPageChange(page - 1);
    }

    public render() {

        const { PageButtonComponent = defaultButton } = this.props;
        const { visiblePages } = this.state;
        const activePage = this.props.page + 1;

        return (
            <div className="Table__pagination">
                <div className="Table__prevPageWrapper">
                    <PageButtonComponent
                        className="Table__pageButton"
                        onClick={() => {
                            if (activePage === 1) {
                                return;
                            }

                            this.changePage(activePage - 1);
                        }}
                        disabled={activePage === 1}
                    >
                        {this.props.previousText}
                    </PageButtonComponent>
                </div>
                <div className="Table__visiblePagesWrapper">
                    {visiblePages.map((page, index, array) => {
                        return (
                            <PageButtonComponent
                                key={page}
                                className={
                                    activePage === page
                                        ? "Table__pageButton Table__pageButton--active"
                                        : "Table__pageButton"
                                }
                                onClick={this.changePage.bind(null, page)}
                            >
                                {array[index - 1] + 2 < page ? `...${page}` : page}
                            </PageButtonComponent>
                        );
                    })}
                </div>
                <div className="Table__nextPageWrapper">
                    <PageButtonComponent
                        className="Table__pageButton"
                        onClick={() => {

                            if (activePage === this.props.pages) {
                                return;
                            }

                            this.changePage(activePage + 1);

                        }}
                        disabled={activePage === this.props.pages}
                    >
                        {this.props.nextText}
                    </PageButtonComponent>
                </div>
            </div>
        );
    }
}

