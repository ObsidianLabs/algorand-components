from pyteal import *

#template variables
tmpl_fee = Int(1000)
tmpl_lease = Bytes("base64", "y9OJ5MRLCHQj8GqbikAUKMBI7hom+SOj8dlopNdNHXI=")
tmpl_amt = Int(200000)
tmpl_rcv = Addr("ZZAF5ARA4MEC5PVDOP64JM5O5MQST63Q2KOY2FLYFLXXD3PFSNJJBYAFZM")
tmpl_fv = Int(55555)
tmpl_lv = Int(56555)
tmpl_cls = Addr("GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A")

def dynamic_fee(tmpl_cls=tmpl_cls,
    tmpl_fv=tmpl_fv,
    tmpl_lv=tmpl_lv,
    tmpl_lease=tmpl_lease,
    tmpl_amt=tmpl_amt,
    tmpl_rcv=tmpl_rcv):

    dynamic_fee_core = And(Global.group_size() == Int(2), Gtxn.type_enum(0) == Int(1), 
        Gtxn.receiver(0) == Txn.sender(),
        Gtxn.amount(0) == Txn.fee(),
        Txn.group_index() == Int(1),
        Txn.type_enum() == Int(1),
        Txn.receiver() == tmpl_rcv,
        Txn.close_remainder_to() == tmpl_cls,
        Txn.amount() == tmpl_amt,
        Txn.first_valid() == tmpl_fv,
        Txn.last_valid() == tmpl_lv,
        Txn.lease() == tmpl_lease)           

    return dynamic_fee_core

print(dynamic_fee().teal())
