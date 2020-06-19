from pyteal import *

""" HTLC
"""
hash_function = "Sha256"
hash_img = Bytes("base64", "QzYhq9JlYbn2QdOMrhyxVlNtNjeyvyJc/I8d8VAGfGc=")
timeout =Int(5555)
max_fee=Int(2000)
tmpl_rcv = Addr("ZZAF5ARA4MEC5PVDOP64JM5O5MQST63Q2KOY2FLYFLXXD3PFSNJJBYAFZM")
owner=Addr("GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A")

def htlc(tmpl_hash_img=hash_img,
    tmpl_timeout=timeout,
    tmpl_owner=owner,
    tmpl_max_fee=max_fee,
    tmpl_hash_fn=Sha256,
    tmpl_rcv=tmpl_rcv):

    fee_cond = Txn.fee() <= tmpl_max_fee
    type_cond = Txn.type_enum() == Int(1)
    amount_cond = Txn.amount() == Int(0)
    r_cond = Txn.receiver() == Global.zero_address()
    recv_cond = ( Txn.close_remainder_to() == tmpl_rcv ).And(
        tmpl_hash_fn(Arg(0)) == tmpl_hash_img)
    esc_cond = (Txn.close_remainder_to()  == tmpl_owner).And(
        Txn.first_valid() > tmpl_timeout)

    htlc_core = fee_cond.And(type_cond).And(r_cond).And(amount_cond).And(recv_cond.Or(esc_cond))   
    return htlc_core

print(htlc().teal())