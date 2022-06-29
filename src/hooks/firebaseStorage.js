import { useState, useEffect } from 'react';
import { getAllDataInCollection, addNewDataInCollection, updateItemFirebase, deleteAllItemsFirebase } from '../lib/firebase'
const STORAGE_KEY = 'itss-todo';

function useFirebaseStorage() {
  const [items, setItems] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      const data = await getAllDataInCollection()
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      } else {
        setItems(data);
      }
    }

    fetchData()
  }, []);

  // const putItems = items => {
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  //   setItems(items);
  // };

  const putItems = async (item) => {
    await addNewDataInCollection(item)
    setItems([...items, item])
  };

  const updateItem = async (item) => {
    item.done = !item.done
    await updateItemFirebase(item)
    const newItems = items.map(item => {
      if (item.key === items.key) {
        item.done = !item.done;
      }
      return item;
    });
    setItems(newItems);
  }

  const clearItems = async () => {
    console.log("hehehee");
    if (items.length !== 0) {
      await deleteAllItemsFirebase(items.map(e => e.key))
    }
    setItems([])
  };

  return [items, putItems, clearItems, updateItem];
}

export default useFirebaseStorage;