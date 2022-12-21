# @version ^0.3.7

struct Eweet:
    id: uint128
    sender: address
    text: String[300]
    display_name: String[40]
    hashtag: String[30]

event NewEweet:
    id: uint128
    sender: indexed(address)
    text: String[300]
    display_name: String[40]
    hashtag: String[30]

struct Reply:
    id: uint128
    sender: address
    text: String[600]
    display_name: String[40]
    to: uint128
    reply_num: uint16

event NewReply:
    id: uint128
    sender: indexed(address)
    text: String[600]
    display_name: String[40]
    to: indexed(uint128)
    reply_num: uint16

eweet_id: public(uint128)
eweets: public(HashMap[uint128, Eweet])
id_per_user: public(HashMap[address, uint64])
eweets_per_user: public(HashMap[address, HashMap[uint64, uint128]])

id_per_hashtag: public(HashMap[String[30], uint64])
eweets_per_hashtag: public(HashMap[String[30], HashMap[uint64, uint128]])

@external
def publish(
    text: String[300], display_name: String[40], hashtag: String[30]
) -> uint128:
    if self.eweets[self.eweets_per_user[msg.sender][self.id_per_user[msg.sender]]].text == text:
        raise "duplicate tweet"

    self.eweet_id += 1
    self.id_per_user[msg.sender] += 1

    self.eweets[self.eweet_id] = Eweet({
        id: self.eweet_id,
        sender: msg.sender,
        text: text,
        display_name: display_name,
        hashtag:hashtag
    })

    self.eweets_per_user[msg.sender][self.id_per_user[msg.sender]] = self.eweet_id

    if hashtag != "":
        self.id_per_hashtag[hashtag] += 1
        self.eweets_per_hashtag[hashtag][self.id_per_hashtag[hashtag]] = self.eweet_id

    log NewEweet(self.eweet_id, msg.sender, text, display_name, hashtag)

    return self.eweet_id

reply_id: public(uint128)
replies: public(HashMap[uint128, Reply])
id_per_to: public(HashMap[uint128, uint16])
replies_per_to: public(HashMap[uint128, HashMap[uint16, uint128]])

@external
def reply(
    text: String[600], display_name: String[40], to: uint128, reply_num: uint16
) -> uint128:
    if to > self.eweet_id:
        raise "replying to non-existings tweet"

    if self.replies[self.replies_per_to[to][self.id_per_to[to]]].text == text:
        raise "duplicate reply"

    self.reply_id += 1
    self.id_per_to[to] += 1

    self.replies[self.reply_id] = Reply({
        id:self.reply_id,
        sender:msg.sender,
        text:text,
        display_name:display_name,
        to:to,
        reply_num: reply_num})

    self.replies_per_to[to][self.id_per_to[to]] = self.reply_id

    log NewReply(self.reply_id, msg.sender, text, display_name, to, reply_num)

    return self.reply_id
