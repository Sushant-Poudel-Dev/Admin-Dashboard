import { useState, useEffect } from "react";
import axios from "axios";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null); // ID of the booking being edited
  const [editedBooking, setEditedBooking] = useState({}); // Stores the edited data
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage] = useState(5); // Number of items per page
  const [searchField, setSearchField] = useState("name"); // Default search field
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering bookings

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/bookings")
      .then((response) => setBookings(response.data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/bookings/${id}`);
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== id)
      );
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBooking((prev) => ({ ...prev, [name]: value }));
  };

  const saveEditedBooking = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/bookings/${id}`,
        editedBooking
      );
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === id ? response.data : booking
        )
      );
      setEditingId(null); // Exit editing mode
      setEditedBooking({});
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleClickStyle = () => {
    const style = document.getElementsByClassName("bookingPageMainDiv");
    console.log(style);
    style.classList.add("clickStyle");
  };

  const renderPaginationButtons = () => {
    const maxVisiblePages = 5; // Maximum number of pagination buttons to display
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    // Adjust startPage if endPage reaches totalPages
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    const buttons = [];

    // Previous button
    buttons.push(
      <button
        key='prev'
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </button>
    );

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key='next'
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </button>
    );

    return buttons;
  };

  // Filtering function based on search term and selected field
  const filteredBookings = bookings.toReversed().filter((booking) => {
    if (searchField === "name") {
      return booking.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    } else if (searchField === "venue") {
      return booking.venue.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === "services") {
      return booking.services
        .join(", ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className='bookingPage'>
      <div className='bookingPageNavbar'>
        <div>
          <h1>Bookings</h1>
          <p>See your bookings till today</p>
        </div>
        <div className='search-barContainer'>
          <div className='search-bar'>
            <input
              type='text'
              placeholder='Search with filter'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <option value='name'>Name</option>
              <option value='venue'>Venue</option>
              <option value='services'>Services</option>
            </select>
          </div>
        </div>
      </div>
      {/* Search Bar with Dropdown */}

      <div className='bookingPageTableHeader'>
        <div>Date</div>
        <div>Name</div>
        <div>Venue</div>
        <div>Service</div>
        <div>Action</div>
      </div>

      {filteredBookings.length === 0 ? (
        <p className='bookingPageError'>No bookings available</p>
      ) : (
        filteredBookings
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((booking) => (
            <div
              key={booking.id}
              className={`bookingPageMainDiv ${
                editingId === booking.id ? "clickStyle" : ""
              }`}
            >
              {editingId === booking.id ? (
                <>
                  <div className='editingDivContainer'>
                    <div className='editingDiv'>
                      <input
                        type='text'
                        name='date'
                        value={editedBooking.date || booking.date}
                        onChange={handleInputChange}
                        placeholder='Customer Name'
                      />
                      <input
                        type='text'
                        name='customerName'
                        value={
                          editedBooking.customerName || booking.customerName
                        }
                        onChange={handleInputChange}
                        placeholder='Customer Name'
                      />
                      <input
                        type='text'
                        name='venue'
                        value={editedBooking.venue || booking.venue}
                        onChange={handleInputChange}
                        placeholder='Venue'
                      />
                      <input
                        type='text'
                        name='services'
                        value={
                          editedBooking.services
                            ? editedBooking.services.join(", ")
                            : booking.services.join(", ")
                        }
                        onChange={(e) =>
                          setEditedBooking((prev) => ({
                            ...prev,
                            services: e.target.value
                              .split(",")
                              .map((s) => s.trim()),
                          }))
                        }
                        placeholder='Services (comma-separated)'
                      />
                      <div className='editingBookingButtons'>
                        <button onClick={() => saveEditedBooking(booking.id)}>
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditedBooking({});
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='booking-date'>{booking.date}</div>
                  <div className='verticleLine'></div>
                  <div className='booking-name'>{booking.customerName}</div>
                  <div className='verticleLine'></div>
                  <div className='booking-venue'>{booking.venue}</div>
                  <div className='verticleLine'></div>
                  <div className='booking-services'>
                    {booking.services.join(", ")}
                  </div>
                  <div className='booking-actions'>
                    <button
                      onClick={() => {
                        setEditingId(booking.id);
                        setEditedBooking(booking);
                        handleClickStyle();
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => deleteBooking(booking.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
      )}
      <div className='pagination'>{renderPaginationButtons()}</div>
    </div>
  );
};

export default BookingsPage;
