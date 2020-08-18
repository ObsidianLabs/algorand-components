from pyteal import *

#template variables
tmpl_amt = Int(1000000)
tmpl_rcv = Addr("") # paste a receiver address
tmpl_cls = Addr("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ")
tmpl_fv = Int(8000000)
tmpl_lv = Int(8888888)
tmpl_lease = Bytes("base64", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE=")

def dynamic_fee(tmpl_amt=tmpl_amt,
    tmpl_rcv=tmpl_rcv,
    tmpl_cls=tmpl_cls,
    tmpl_fv=tmpl_fv,
    tmpl_lv=tmpl_lv,
    tmpl_lease=tmpl_lease):

    dynamic_fee_core = And(
        Global.group_size() == Int(2),
        Gtxn.type_enum(0) == Int(1),
        Txn.group_index() == Int(1),
        Txn.type_enum() == Int(1),
        Gtxn.amount(0) == Txn.fee(),
        Gtxn.receiver(0) == Txn.sender(),
        Txn.amount() == tmpl_amt,
        # Txn.receiver() == tmpl_rcv,
        Txn.close_remainder_to() == tmpl_cls,
        # Txn.first_valid() == tmpl_fv,
        # Txn.last_valid() == tmpl_lv,
        Txn.lease() == tmpl_lease
    )

    return dynamic_fee_core

print(dynamic_fee().teal())
