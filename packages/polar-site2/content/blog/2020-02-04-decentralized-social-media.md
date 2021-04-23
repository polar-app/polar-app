---
title: Decentralized social media using federated and peer-to-peer protocols
date: 2020-02-04T08:00:00.000-08:00
layout: post
description: The following overview is loosely based on a presentation by Jay Graber at the Internet Archive in San Francisco on Jan 21, 2020
large_image: https://i.imgur.com/BaJJyCJ.png   
---

# Decentralized social media using federated and peer-to-peer protocols

The following overview is loosely based on a presentation by Jay Graber at the Internet Archive in San Francisco on Jan 21, 2020

<img src="https://i.imgur.com/BaJJyCJ.png" class="img-fluid">

<p class="text-center"><b>Presentation at Internet Archive on decentralized social media</b></p>

Given the impact social media has had on our lives in the last few years - from less privacy to election interfering - an increasing focus has been put on decentralized social media platforms as a potential solution. In addition, the crypto boom of 2017 brought blockchain to the mainstream media, which further helped out projects in that space

While these platforms promise a better solution to existing social media, no single platform has to date achieved the kind of success seen in the early stages of Facebook, Twitter, Reddit, and others. In fact, not only do many face technical challenges and delays, the business model is oftentimes not clear either

Decentralized social media platforms are primarily built on two types of protocols - federated protocols or peer-to-peer protocols

## Federated protocols

A federated protocol allows multiple small networks to talk to each other without giving away too much control

Examples of platforms using such a protocol include ActivityPub built on Mastodon. ActivityPub is a social network with nearly about 2.2M users and roughly doubled its user base in 2019
Matrix is a chat platform and another example using a federated protocol with ~11M users. Matrix allows multiple communication platforms to all integrate into one

<img class="img-fluid border" src="https://i.imgur.com/PCUysdj.png">
<p class="text-center"><b>ActivityPub's landing page</b></p>

<img class="img-fluid border" src="https://i.imgur.com/91LoKlw.png">
<p class="text-center"><b>Matrix' approach to decentralized communication</b></p>

The main advantages of federated protocols are a familiar UX, no user key management, and control of moderation policy by the user. Generally speaking, platforms using federated protocols are closer to what we are used to seeing in social media. For example, they allow for users to change and delete content

The key disadvantages are a stronger dependence on admins, identities being potentially bound to specific servers, and platforms can lack privacy

## Peer-to-peer protocols

In a peer-to-peer protocol, no distinction is made between a client and a server, meaning all nodes are equal

The most well-known example of such a protocol is scuttlebutt. Scuttlebutt is a protocol for gossip sharing with an estimated 16k nodes. Social media platforms built on it include Patchwork, Manyverse, and Planetary

<img class="img-fluid border" src="https://i.imgur.com/chXxdT4.png">
<p class="text-center"><b>Manyverse - a social network based on a scuttlebutt's peer-to-peer protocol</b></p>

In peer-to-peer protocols, users are identified by public keys or human-readable usernames. Moderation is typically achieved bottoms-up which provides a lot of flexibility on which kind of content and under what rules they want to engage with

Additional networks using a peer-to-peer network, though not built on scuttlebutt, are Aether (a Reddit-style network) and Iris (an ethereum-based network)

The key advantages of peer-to-peer protocols are the fact that users are able to control their data and identity, capacity scales with demand (since every node is equal), and a local-first approach

On the flipside, peer-to-peer protocols have a few disadvantages as well. Namely, no password recovery, a resource-intensive approach (all data is stored on users’ nodes), and an unfamiliar UX (no deletion, changing of content, no cross-device usage,...). In particular the relatively user-unfriendly features give the peer-to-peer protocols a distinct disadvantage over federated protocols in the social media space

Furthermore, a big issue for such protocols is the lack of a clear monetization strategy

## How blockchain is used in the design

Blockchain is used in two parts of the design - data storage and monetization / payments

Data can be irreversible stored on a blockchain. Cryptocurrencies built on top of the blockchain protocol are oftentimes employed for monetization of the platform and payments between users

There are a few examples that store data on the blockchain AND utilize the blockchain for payments. The best-known example is Steem. Steem is a Reddit-style platform. In addition, the Steem blockchain protocol is being used to build a host of other social media and content sharing platforms

Examples of platforms that only use blockchain infrastructure for payments include DTube and Minds. DTube is a perfect example of the limitations of blockchain-based content platforms. DTube, a blockchain-based Youtube competitor, requires a huge amount of data to be stored, which makes it practically impossible to use blockchain

Advantages of blockchain-based social media platforms include decentralized monetization and payments, and decentralized global consensus on identities

However, such platforms also come with significant disadvantages. Namely, key management issues with potential of financial loss, non-modifiable on-chain data, and publicly visible on-chain data. In particular, the last point is contentious among privacy-centric users

In addition, at the current state of blockchain, the base-layer blockchain is not scalable, though research is actively going on to resolve this problem

## Summary

In summary, decentralized social media platforms have not been able to break into the mainstream at the pace traditional ones were able to. It remains to be seen if further privacy violations, data misuse, and other topics will ultimately lead to large-scale adoption

