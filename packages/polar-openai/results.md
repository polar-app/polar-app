# 2021/07/09 

Pricing: 

Davinci       $0.0600
Curie         $0.0060
Babbage       $0.0012
Ada           $0.0008

## davinci

max_tokens: 25
search_model: davinci

davinci    Who did Tutankhamun marry?                                             ['Ankhesenamun.']
davinci    How old was Tutankhamun when he rose to the throne?                    ['Eight or nine years old.']
davinci    Who restored the Ancient Egyptian religion?                            ['Tutankhamun.']
davinci    Where did King Tut move his father's remains?                          ['To the Valley of the Kings.']
davinci    Who funded Howard Carter's discovery of Tutankhamun's tomb?            ['Lord Carnarvon.']
davinci    What was the status of King Tut's tomb when it was found?              ['It was a tomb that was robbed at least twice in antiquity.']
davinci    What is the curse of the pharaohs?                                     ['The curse of the pharaohs is a curse said to be attached to any person who disturbs the mummy of an Ancient']
davinci    How tall was King Tut?                                                 ['167 cm.']
davinci    How tall was King Tut in feet?                                         ['5\'6"']
davinci    How did King Tut die?                                                  ['He was murdered by a blow to the head.']

## curie

max_tokens: 25
search_model: curie

curie      Who did Tutankhamun marry?                                             ['His wife was Ankhesenamun.']
curie      How old was Tutankhamun when he rose to the throne?                    ['He was between eight and nine years old when he ascended the throne and became Pharaoh, taking the throne name Nebkheper']
curie      Who restored the Ancient Egyptian religion?                            ['Tutankhamun.']
curie      Where did King Tut move his father's remains?                          ['The Valley of the Kings.']
curie      Who funded Howard Carter's discovery of Tutankhamun's tomb?            ['Lord Carnarvon.']
curie      What was the status of King Tut's tomb when it was found?              ['It was a tomb for a minor king.']
curie      What is the curse of the pharaohs?                                     ['The curse of the pharaohs is the belief that the death of those who discovered the tomb of Tutankhamun was']
curie      How tall was King Tut?                                                 ['5\'6"']
curie      How tall was King Tut in feet?                                         ['5\'6"']
curie      How did King Tut die?                                                  ['He was murdered.']

## babbage 

max_tokens: 25
search_model: babbage

babbage
====
babbage    Who did Tutankhamun marry?                                             ['Ankhesenpaaten, his half-sister.']
babbage    How old was Tutankhamun when he rose to the throne?                    ['Eight or nine years old.']
babbage    Who restored the Ancient Egyptian religion?                            ['Tutankhamun.']
babbage    Where did King Tut move his father's remains?                          ['The Valley of the Kings.']
babbage    Who funded Howard Carter's discovery of Tutankhamun's tomb?            ['Lord Carnarvon.']
babbage    What was the status of King Tut's tomb when it was found?              ['The tomb was opened in 1922.']
babbage    What is the curse of the pharaohs?                                     ['The curse of the pharaohs is a popular myth that has been used to explain the deaths of some of the people involved']
babbage    How tall was King Tut?                                                 ['He was about 5 ft 6 in tall.']
babbage    How tall was King Tut in feet?                                         ['He was about 5 feet 6 inches tall.']
babbage    How did King Tut die?                                                  ['He was killed by a blow to the head.']

## ada

max_tokens: 25
search_model: ada

ada
====
ada        Who did Tutankhamun marry?                                             ['Tutankhamun married Ankhesenamun, his half-sister, at the age of nine or ten years']
ada        How old was Tutankhamun when he rose to the throne?                    ['Tutankhamun was between eight and nine years of age when he ascended the throne.']
ada        Who restored the Ancient Egyptian religion?                            ["The restoration of the Ancient Egyptian religion was carried out by Tutankhamun's son, Horemheb. He was"]
ada        Where did King Tut move his father's remains?                          ["The remains of Tutankhamun's father were moved to the Valley of the Kings in the early years of his reign."]
ada        Who funded Howard Carter's discovery of Tutankhamun's tomb?            ['The government of Egypt, the British Museum, the British Museum of Natural History, the British Museum of Egypt, the British Museum']
ada        What was the status of King Tut's tomb when it was found?              ['The tomb was found in 1922.']
ada        What is the curse of the pharaohs?                                     ['The curse of the pharaohs is that the pharaohs are the only ones who can be killed.']
ada        How tall was King Tut?                                                 ['He was approximately 167 cm (5 ft 6 in) tall.']
ada        How tall was King Tut in feet?                                         ['He was about 168 cm (5 ft 6 in) tall.']
ada        How did King Tut die?                                                  ['He was killed by his own hand.']

# Now reworking by specifying the search model

We have to do this because the way the API works is that it first finds applicable documents, then runs the completions API across them.

We could shop a first version that uses a combination of Elasticsearch to find the docs, and then the OpenAI completions API.

davinci
max_tokens: 35
search_model: ada
====
davinci    Who did Tutankhamun marry?                                             ['Ankhesenamun.']
davinci    How old was Tutankhamun when he rose to the throne?                    ['Eight or nine years old.']
davinci    Who restored the Ancient Egyptian religion?                            ['Tutankhamun.']
davinci    Where did King Tut move his father's remains?                          ['To the Valley of the Kings.']
davinci    Who funded Howard Carter's discovery of Tutankhamun's tomb?            ['Lord Carnarvon.']
davinci    What was the status of King Tut's tomb when it was found?              ['It was intact.']
davinci    What is the curse of the pharaohs?                                     ['The curse of the pharaohs is a curse said to be attached to any person who disturbs the mummy of an Ancient Egyptian person, especially a pharaoh.']
davinci    How tall was King Tut?                                                 ['King Tut was 5\'6" tall.']
davinci    How tall was King Tut in feet?                                         ['5\'6"']
davinci    How did King Tut die?                                                  ['He was murdered.']
