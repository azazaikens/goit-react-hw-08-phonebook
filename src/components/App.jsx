import { FormContacts } from './Formcontacts/Formcontacts';
import { ListContacts } from './Listcontacts/Listcontacts';
import { Filter } from './Filter/Filter';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeFilter,
  addContact,
  fetchContacts,
  deleteContact,
} from 'redux/phonebook/reducer';
import { useEffect } from 'react';
import { nanoid } from 'nanoid';

export const App = () => {
  const contacts = useSelector(state => state.phonebook.contacts);
  const filter = useSelector(state => state.phonebook.filter);
  const isLoading = useSelector(state => state.phonebook.isLoading);
  const error = useSelector(state => state.phonebook.error);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const handleAddContact = ({ name, phone }) => {
    const hasDuplicateContacts = contacts.find(
      contact => contact.name === name && contact.phone === phone
    );

    if (hasDuplicateContacts) {
      alert(`${name} is already in contacts.`);
      return;
    }

    dispatch(
      addContact({
        id: nanoid(),
        name,
        phone,
      })
    );
  };

  const handleFilterChange = event => {
    const inputFilter = event.target.value;
    dispatch(changeFilter(inputFilter));
  };

  const btnDeleteContact = contactId => {
    dispatch(deleteContact(contactId));
  };

  const filterContacts = contacts.filter(contact => {
    return (
      contact.name.toLowerCase().includes(filter.trim().toLowerCase()) ||
      contact.phone.includes(filter)
    );
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <h1>Phonebook</h1>
      <FormContacts handleAddContact={handleAddContact} />
      <h2>Contacts</h2>
      <Filter onChange={handleFilterChange} filter={filter} />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {error && <div>{error}</div>}
          <ListContacts
            contacts={filterContacts}
            deleteContact={btnDeleteContact}
          />
        </>
      )}
    </div>
  );
};
