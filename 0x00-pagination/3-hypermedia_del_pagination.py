#!/usr/bin/env python3
"""
Deletion-resilient hypermedia pagination
"""

import csv
from typing import List, Dict


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by sorting position, starting at 0
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """Retrieve hyper-indexed dataset information.

        Args:
            index (int, optional): The current start index of the return page.
            Defaults to None.
            page_size (int, optional): The current page size. Defaults to 10.

        Returns:
            Dict: A dictionary containing hyper-indexed dataset information.
        """
        assert index is None or (isinstance(index, int) and index >= 0),

        dataset_length = len(self.dataset())
        next_index = index + page_size if index is not None else None

        if index is not None:
            assert index < dataset_length, "Index is out of range"
            start_index = index
            end_index = min(index + page_size, dataset_length)
            data = [self.indexed_dataset().get(i, []) for i in range(start_index, end_index)]
        else:
            data = []

        return {
            "index": index,
            "next_index": next_index,
            "page_size": page_size,
            "data": data
        }


# Example usage
if __name__ == "__main__":
    server = Server()

    # Test get_hyper_index method
    start_index = 20
    page_size = 10
    hyper_data = server.get_hyper_index(start_index, page_size)
    print("Hyper-indexed data:")
    for key, value in hyper_data.items():
        print(f"{key}: {value}")
