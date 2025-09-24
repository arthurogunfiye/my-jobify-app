import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import Wrapper from '../assets/wrappers/PageBtnContainer';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAllJobsContext } from '../pages/AllJobs';

const ComplexPageButtonsContainer = () => {
  const {
    data: { currentPage, numberOfPages }
  } = useAllJobsContext();

  const pages = Array.from({ length: numberOfPages }, (_, index) => {
    return index + 1;
  });

  const { search, pathname } = useLocation();
  const navigate = useNavigate();

  const handlePageChange = pageNumber => {
    const searchParams = new URLSearchParams(search);
    searchParams.set('page', pageNumber);
    const newPath = `${pathname}?${searchParams.toString()}`;
    navigate(newPath);
  };

  const addPageButton = ({ pageNumber, activeClass }) => {
    return (
      <button
        type='button'
        className={`btn page-btn ${activeClass && 'active'}`}
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
      >
        {pageNumber}
      </button>
    );
  };

  const renderPageButton = () => {
    const pageButtons = [];

    // First page
    pageButtons.push(
      addPageButton({ pageNumber: 1, activeClass: currentPage === 1 })
    );

    // Ellipsis after first page
    if (currentPage > 3) {
      pageButtons.push(
        <span key='dots-1' className='page-btn dots'>
          ...
        </span>
      );
    }

    // One before current page
    if (currentPage !== 1 && currentPage !== 2) {
      pageButtons.push(
        addPageButton({
          pageNumber: currentPage - 1,
          activeClass: false
        })
      );
    }

    // Current page
    if (currentPage !== 1 && currentPage !== numberOfPages) {
      pageButtons.push(
        addPageButton({
          pageNumber: currentPage,
          activeClass: true
        })
      );
    }

    // One after current page
    if (currentPage !== numberOfPages && currentPage !== numberOfPages - 1) {
      pageButtons.push(
        addPageButton({
          pageNumber: currentPage + 1,
          activeClass: false
        })
      );
    }

    // Ellipsis before last page
    if (currentPage < numberOfPages - 2) {
      pageButtons.push(
        <span key='dots+1' className='page-btn dots'>
          ...
        </span>
      );
    }

    // Last page
    pageButtons.push(
      addPageButton({
        pageNumber: numberOfPages,
        activeClass: currentPage === numberOfPages
      })
    );

    return pageButtons;
  };

  return (
    <Wrapper>
      <button
        className='btn prev-btn'
        onClick={() => {
          let prevPage = currentPage - 1;
          if (prevPage < 1) prevPage = numberOfPages;
          handlePageChange(prevPage);
        }}
      >
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className='btn-container'>{renderPageButton()}</div>
      <button
        className='btn next-btn'
        onClick={() => {
          let nextPage = currentPage + 1;
          if (nextPage > numberOfPages) nextPage = 1;
          handlePageChange(nextPage);
        }}
      >
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};

export default ComplexPageButtonsContainer;
